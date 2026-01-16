import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User } from '../types';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    console.log('Setting up auth listener...');
    let userDocUnsubscribe: (() => void) | null = null;

    // Handle redirect result from Google Sign-In on mobile
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log('Google redirect sign-in successful:', result.user.email);
        }
      })
      .catch((error) => {
        console.error('Google redirect sign-in error:', error.code, error.message);
      });

    const authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clean up previous user document listener if exists
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
        userDocUnsubscribe = null;
      }

      if (firebaseUser) {
        console.log('Firebase user authenticated:', firebaseUser.uid, firebaseUser.email);

        // Set up real-time listener for user document
        const userDocRef = doc(db, 'users', firebaseUser.uid);

        try {
          // First check if document exists
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            // Create user document if it doesn't exist
            const newUserData = {
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              isAdmin: false,
            };
            await setDoc(userDocRef, newUserData);
            console.log('New user document created:', newUserData);
          }

          // Now set up real-time listener for changes
          console.log('Setting up onSnapshot listener for user document');
          userDocUnsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            console.log('onSnapshot callback fired, document exists:', docSnapshot.exists());
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              console.log('Raw userData from Firestore:', userData);
              console.log('userData.isAdmin value:', userData.isAdmin, 'type:', typeof userData.isAdmin);

              const user = {
                id: firebaseUser.uid,
                name: userData.name || firebaseUser.displayName || 'User',
                email: userData.email || firebaseUser.email || '',
                avatar: firebaseUser.photoURL || '',
                isAdmin: userData.isAdmin || false,
              };

              console.log('Constructed user object:', user);
              console.log('user.isAdmin BEFORE setCurrentUser:', user.isAdmin);
              setCurrentUser(user);
              console.log('User data updated from Firestore - isAdmin:', user.isAdmin);
            }
            setLoading(false);
          }, (error) => {
            console.error('Error listening to user document:', error);
            setCurrentUser(null);
            setLoading(false);
          });

        } catch (error) {
          console.error('Error setting up user data:', error);
          setCurrentUser(null);
          setLoading(false);
        }
      } else {
        console.log('No Firebase user - setting to null');
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up auth listener');
      authUnsubscribe();
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
      }
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
