import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from './types';
import Dashboard from './components/Dashboard/Dashboard';
import LoginModal from './components/LoginModal/LoginModal';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        // We'll handle user data in the Dashboard component
        // Check if user is admin based on a custom claim or Firestore
        const adminClaim = await firebaseUser.getIdTokenResult().catch(() => null);
        const isAdminFromToken = adminClaim?.claims?.admin === true;

        setCurrentUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || undefined,
          isAdmin: isAdminFromToken || false,
        });
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show login modal callback
  const handleShowLogin = () => {
    setShowLoginModal(true);
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
  };

  // Temporary helper function to set current user as admin
  // You can call this from browser console: window.setAsAdmin()
  const setCurrentUserAsAdmin = async () => {
    if (auth.currentUser) {
      try {
        // This would normally be done through Firebase Admin SDK
        // For now, you can manually set this in Firebase Console
        console.log('Admin setup instructions:');
        console.log('1. Go to Firebase Console > Authentication > Users');
        console.log('2. Select your user');
        console.log('3. In User claims section, add: {"admin": true}');
        console.log('4. Save and refresh the page');

        // Alternative: Update the user's isAdmin field in Firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { isAdmin: true });
        console.log('Admin role set in Firestore');
      } catch (error) {
        console.error('Error setting admin role:', error);
      }
    }
  };

  // Make it accessible globally for easy console access
  (window as any).setAsAdmin = setCurrentUserAsAdmin;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <>
      <Dashboard
        currentUser={currentUser}
        onShowLogin={handleShowLogin}
      />
      {showLoginModal && (
        <LoginModal onClose={handleLoginClose} />
      )}
    </>
  );
}

export default App;
