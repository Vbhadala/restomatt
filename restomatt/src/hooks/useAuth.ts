import { useState, useEffect } from 'react';
import { User as FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User } from '../types';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({
            id: firebaseUser.uid,
            name: userData.name || firebaseUser.displayName || 'User',
            email: userData.email || firebaseUser.email || '',
            avatar: firebaseUser.photoURL || '',
            isAdmin: userData.isAdmin || false,
          });
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
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
