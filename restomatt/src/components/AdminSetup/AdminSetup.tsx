import React, { useState } from 'react';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

const AdminSetup: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleSetAdmin = async () => {
    if (!auth.currentUser) {
      setMessage({ type: 'error', text: 'No user is currently logged in' });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);

      // Check if user document exists
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        setMessage({ type: 'error', text: 'User document not found. Please log out and log back in.' });
        return;
      }

      // Update the isAdmin field
      await updateDoc(userRef, {
        isAdmin: true
      });

      setMessage({
        type: 'success',
        text: 'Admin privileges granted successfully! Please refresh the page to see changes.'
      });

      // Auto-refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('Error setting admin:', error);
      setMessage({
        type: 'error',
        text: `Failed to set admin privileges: ${error.message || 'Unknown error'}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Setup</h1>
          <p className="text-sm text-gray-600">
            Grant admin privileges to your account
          </p>
        </div>

        {/* Current User Info */}
        {auth.currentUser && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Current User</p>
            <p className="font-medium text-gray-900">{auth.currentUser.email}</p>
            <p className="text-xs text-gray-500 mt-1">UID: {auth.currentUser.uid}</p>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className={`mb-6 rounded-lg p-4 flex items-start space-x-3 ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' :
            message.type === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            {message.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />}
            {message.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />}
            {message.type === 'info' && <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />}
            <p className={`text-sm ${
              message.type === 'success' ? 'text-green-800' :
              message.type === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">What this does:</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Sets your account's isAdmin flag to true</li>
            <li>• Grants access to the Admin panel</li>
            <li>• Enables task creation and assignment</li>
            <li>• Allows viewing all tasks and attendance</li>
          </ul>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSetAdmin}
          disabled={isProcessing || !auth.currentUser}
          className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Shield className="h-5 w-5" />
              <span>Grant Admin Privileges</span>
            </>
          )}
        </button>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <a href="/app" className="text-sm text-blue-600 hover:text-blue-800">
            Back to Dashboard
          </a>
        </div>

        {/* Warning */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>⚠️ Only grant admin privileges to trusted accounts</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
