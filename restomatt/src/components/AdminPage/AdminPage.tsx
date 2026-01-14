import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import AdminPanel from '../AdminPanel/AdminPanel';
import { User } from '../../types';

interface AdminPageProps {
  currentUser: User;
}

const AdminPage: React.FC<AdminPageProps> = ({ currentUser }) => {
  const navigate = useNavigate();

  // Check if user is admin
  if (!currentUser.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminPanel />
    </div>
  );
};

export default AdminPage;
