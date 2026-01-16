import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
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
export const googleProvider = new GoogleAuthProvider();

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

      // Check Firestore for admin status
      const { doc, getDoc } = await import('firebase/firestore');
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Firestore user data:', {
          name: userData.name,
          email: userData.email,
          isAdmin: userData.isAdmin,
          hasIsAdminField: 'isAdmin' in userData,
          isAdminType: typeof userData.isAdmin,
          isAdminValue: userData.isAdmin === true ? 'TRUE' : userData.isAdmin === false ? 'FALSE' : 'OTHER'
        });
      } else {
        console.log('⚠️ Firestore user document does not exist for UID:', user.uid);
      }
    } catch (error) {
      console.error('Failed to get auth token or user data:', error);
    }
  }
});

// Firestore Security Rules to copy into Firebase Console > Firestore Database > Rules
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Users collection - users can read/write their own, admins can read all
    match /users/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || isAdmin());
      allow write: if isAuthenticated() && isOwner(userId);
      // Allow admins to update any user (for toggling admin status)
      allow update: if isAdmin();
    }

    // Project types and materials are shared - authenticated users can read/write
    match /projectTypes/{document} {
      allow read, write: if isAuthenticated();
    }

    match /materials/{document} {
      allow read, write: if isAuthenticated();
    }

    // Projects - users can read/write their own, admins can read all
    match /projects/{projectId} {
      allow read: if isAuthenticated() &&
        (
          // Users can read their own projects
          (resource != null && isOwner(resource.data.userId)) ||
          // Admins can read all projects
          isAdmin()
        );
      allow write: if isAuthenticated() &&
        (
          // For existing documents: check owner
          (resource != null && isOwner(resource.data.userId)) ||
          // For new documents: check the data being written
          (resource == null && isOwner(request.resource.data.userId))
        );
      // Allow admins to delete any project
      allow delete: if isAdmin();
    }

    // Leads (CRM) - users can read/write their own, admins can read all
    match /leads/{leadId} {
      allow read: if isAuthenticated() &&
        (
          // Users can read their own leads
          (resource != null && isOwner(resource.data.userId)) ||
          // Admins can read all leads
          isAdmin()
        );
      allow write: if isAuthenticated() &&
        (
          // For existing documents: check owner
          (resource != null && isOwner(resource.data.userId)) ||
          // For new documents: check the data being written
          (resource == null && isOwner(request.resource.data.userId))
        );
      // Allow admins to delete any lead
      allow delete: if isAdmin();
    }

    // Day Activities (DayBook) - users can read/write their own, admins can read all
    match /dayActivities/{activityId} {
      allow read: if isAuthenticated() &&
        (
          // Users can read their own activities
          (resource != null && isOwner(resource.data.userId)) ||
          // Admins can read all activities
          isAdmin()
        );
      allow write: if isAuthenticated() &&
        (
          // For existing documents: check owner
          (resource != null && isOwner(resource.data.userId)) ||
          // For new documents: check the data being written
          (resource == null && isOwner(request.resource.data.userId))
        );
    }

    // Attendance - users can read/write their own, admins can read all
    match /attendance/{attendanceId} {
      allow read: if isAuthenticated() &&
        (
          // Users can read their own records
          (resource != null && isOwner(resource.data.userId)) ||
          // Admins can read all records
          isAdmin()
        );
      allow write: if isAuthenticated() &&
        (
          // For existing documents: check owner
          (resource != null && isOwner(resource.data.userId)) ||
          // For new documents: check the data being written
          (resource == null && isOwner(request.resource.data.userId))
        );
    }

    // Tasks - users can read assigned tasks, admins can read/write all
    match /tasks/{taskId} {
      allow read: if isAuthenticated() &&
        (
          // Users can read tasks assigned to them
          (resource != null && isOwner(resource.data.assignedToId)) ||
          // Users can read tasks they created
          (resource != null && isOwner(resource.data.assignedById)) ||
          // Admins can read all tasks
          isAdmin()
        );
      allow create: if isAuthenticated() &&
        (
          // Admins can create tasks for anyone
          isAdmin() ||
          // Users can create tasks assigned to themselves
          isOwner(request.resource.data.assignedToId)
        );
      allow update: if isAuthenticated() &&
        (
          // Admins can update all fields
          isAdmin() ||
          // Users can only update status and notes of their assigned tasks
          (isOwner(resource.data.assignedToId) &&
           request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'notes', 'updatedAt']))
        );
      allow delete: if isAdmin();
    }

    // Catch-all: deny access to any other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
*/

export default app;
