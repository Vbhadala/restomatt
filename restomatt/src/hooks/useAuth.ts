import { useState, useEffect } from 'react';
import { User as FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User } from '../types';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    console.log('Setting up auth listener...');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('Firebase user authenticated:', firebaseUser.uid, firebaseUser.email);
        // Get user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const user = {
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || 'User',
              email: userData.email || firebaseUser.email || '',
              avatar: firebaseUser.photoURL || '',
              isAdmin: userData.isAdmin || false,
            };
            setCurrentUser(user);
            console.log('User data set:', user);
          } else {
            // Create user document if it doesn't exist
            const newUser = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || '',
              isAdmin: false, // Default to non-admin
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setCurrentUser(newUser);
            console.log('New user created and set:', newUser);
          }
        } catch (error) {
          console.error('Error setting up user data:', error);
          setCurrentUser(null);
        }
      } else {
        console.log('No Firebase user - setting to null');
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Create user document in Firestore
      const userData = {
        name,
        email,
        isAdmin: false,
      };
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  return {
    currentUser,
    loading,
    signIn,
    signUp,
    logout,
    availableUsers: [
      {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false
      },
      {
        id: '2',
        name: 'Test Admin',
        email: 'admin@example.com',
        isAdmin: true
      }
    ], // Demo users for Header component
    switchUser: async (userId: string) => {
      // Demo switching - in real app might show user selection
      console.log('Switching to user:', userId);
    }, // Demo switch user for Header component
  };
};
