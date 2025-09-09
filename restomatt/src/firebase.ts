import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Firebase project config for restomatt-4517b
  apiKey: "AIzaSyBibrHzW77iJyHA4fbcwoRm3tIvRRfzzwE",
  authDomain: "restomatt-4517b.firebaseapp.com",
  projectId: "restomatt-4517b",
  storageBucket: "restomatt-4517b.firebasestorage.app",
  messagingSenderId: "68209707252",
  appId: "1:68209707252:web:b38bdf12ab9db145c7f6a1",
  measurementId: "G-78C2FVV9N8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Debug authentication state
auth.onAuthStateChanged(async (user) => {
  console.log('Firebase auth state changed:', user ? {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName
  } : 'No user');

  if (user) {
    // Get and log the current user's auth token to verify it's valid
    try {
      const token = await user.getIdToken();
      console.log('Current auth token retrieved successfully (first 50 chars):', token.substring(0, 50));
    } catch (error) {
      console.error('Failed to get auth token:', error);
    }
  }
});

// Firestore Security Rules to copy into Firebase Console > Firestore Database > Rules
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Project types and materials are shared - authenticated users can read/write
    match /projectTypes/{document} {
      allow read, write: if request.auth != null;
    }

    match /materials/{document} {
      allow read, write: if request.auth != null;
    }

    // Users can only read/write their own projects
    match /projects/{projectId} {
      allow read, write: if request.auth != null &&
        (
          // For existing documents: check owner
          (resource != null && request.auth.uid == resource.data.userId) ||
          // For new documents: check the data being written
          (resource == null && request.auth.uid == request.resource.data.userId)
        );
    }

    // Collections can only have their own specific documents
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
*/

export default app;
