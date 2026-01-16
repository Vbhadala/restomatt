import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from './types';
import LandingPage from './components/LandingPage/LandingPage';
import HomePage from './components/HomePage/HomePage';
import AppPage from './components/AppPage/AppPage';
import CRMPage from './components/CRMPage/CRMPage';
import DayBookPage from './components/DayBookPage/DayBookPage';
import AttendancePage from './components/AttendancePage/AttendancePage';
import TasksPage from './components/TasksPage/TasksPage';
import SettingsPage from './components/SettingsPage/SettingsPage';
import CollectionPage from './components/CollectionPage/CollectionPage';
import LoginModal from './components/LoginModal/LoginModal';
import { Collection } from './data/collections';
import {
  AdminDashboard,
  AdminUsersPage,
  AdminQuotationsPage,
  AdminLeadsPage,
  AdminTasksPage,
  AdminAttendancePage,
  AdminDayBookPage,
  AdminSettingsPage,
} from './components/admin';

// Protected Route component
interface ProtectedRouteProps {
  children: React.ReactNode;
  currentUser: User | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, currentUser }) => {
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// Main App Routes component
interface AppRoutesProps {
  currentUser: User | null;
  onShowLogin: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ currentUser, onShowLogin }) => {
  const navigate = useNavigate();
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  const handleStartProject = () => {
    if (!currentUser) {
      onShowLogin();
      return;
    }
    navigate('/app');
  };

  const handleViewCollection = (collection: Collection) => {
    if (!currentUser) {
      onShowLogin();
      return;
    }
    setSelectedCollection(collection);
    navigate('/collection');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            onStartProject={handleStartProject}
            onViewCollection={handleViewCollection}
            isAuthenticated={!!currentUser}
          />
        }
      />
      <Route
        path="/app"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/quotations"
        element={
          <ProtectedRoute currentUser={currentUser}>
            {currentUser && <AppPage currentUser={currentUser} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/crm"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <CRMPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/daybook"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <DayBookPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/attendance"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <AttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/tasks"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <TasksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/settings"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/quotations"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <AdminQuotationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leads"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <AdminLeadsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tasks"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <AdminTasksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <AdminAttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/daybook"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <AdminDayBookPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <AdminSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/collection"
        element={
          <ProtectedRoute currentUser={currentUser}>
            {selectedCollection && (
              <CollectionPage
                collection={selectedCollection}
                onBack={() => navigate('/')}
                onStartProject={handleStartProject}
              />
            )}
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('App.tsx - Firebase user authenticated:', firebaseUser.uid);

        // Read admin status from Firestore instead of custom claims
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnapshot = await getDoc(userDocRef);

          let isAdminValue = false;
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            isAdminValue = userData.isAdmin || false;
            console.log('App.tsx - Read isAdmin from Firestore:', isAdminValue);
          } else {
            // Create user document for new users (e.g., Google Sign-In redirect)
            console.log('App.tsx - Creating user document for new user');
            const newUserData = {
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              isAdmin: false,
            };
            await setDoc(userDocRef, newUserData);
            console.log('App.tsx - User document created');
          }

          setCurrentUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || undefined,
            isAdmin: isAdminValue,
          });

          console.log('App.tsx - Set currentUser with isAdmin:', isAdminValue);
        } catch (error) {
          console.error('App.tsx - Error reading user document:', error);
          setCurrentUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || undefined,
            isAdmin: false,
          });
        }
      } else {
        // User is signed out
        console.log('App.tsx - No Firebase user');
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
    <Router>
      <AppRoutes currentUser={currentUser} onShowLogin={handleShowLogin} />
      {showLoginModal && <LoginModal onClose={handleLoginClose} />}
    </Router>
  );
}

export default App;
