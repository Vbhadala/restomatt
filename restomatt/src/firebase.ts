import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // You'll need to replace these with your actual Firebase project config
  // Get these from Firebase Console > Project Settings > General > Your apps
  apiKey: "AIzaSyBibrHzW77iJyHA4fbcwoRm3tIvRRfzzwE",
  authDomain: "restomatt-4517b.firebaseapp.com",
  projectId: "restomatt-4517b",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

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
        request.auth.uid == resource.data.userId;
    }

    // Collections can only have their own specific documents
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
*/

export default app;
