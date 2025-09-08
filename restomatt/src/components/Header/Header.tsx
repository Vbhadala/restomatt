import React from 'react';
import { User, Settings, Users, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onBackToLanding?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBackToLanding }) => {
  const { currentUser, switchUser, logout, availableUsers } = useAuth();

  if (!currentUser) return null;



  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={onBackToLanding}>
              <h1 className="text-2xl font-bold text-amber-700">Restomatt</h1>
              <p className="text-xs text-gray-500 -mt-1">Furniture Solutions</p>
            </div>

          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="flex items-center space-x-1 text-gray-700 hover:text-amber-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </button>
            )}
            <a href="#" className="text-gray-700 hover:text-amber-700 px-3 py-2 text-sm font-medium transition-colors">
              Projects
            </a>
            {currentUser.isAdmin && (
              <a href="#admin" className="text-gray-700 hover:text-amber-700 px-3 py-2 text-sm font-medium transition-colors">
                Admin
              </a>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            
            {/* User Switcher for Demo */}
            <div className="relative group">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-amber-700" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
                  {currentUser.isAdmin && (
                    <span className="block text-xs text-amber-600">Admin</span>
                  )}
                </div>
              </div>
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-2 text-xs text-gray-500 border-b">Switch User (Demo)</div>
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => switchUser(user.id)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                      currentUser.id === user.id ? 'bg-amber-50 text-amber-700' : 'text-gray-700'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>{user.name}</span>
                    {user.isAdmin && <span className="text-xs text-amber-600">(Admin)</span>}
                  </button>
                ))}
                <div className="border-t">
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
