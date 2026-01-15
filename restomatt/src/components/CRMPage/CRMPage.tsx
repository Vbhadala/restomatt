import React from 'react';
import { Users, Plus, Search, Phone, Mail, MapPin } from 'lucide-react';
import AppLayout from '../AppLayout/AppLayout';

const CRMPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Relationship Management</h1>
          <p className="text-gray-600">Manage your customer contacts and relationships</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <button className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Customer</span>
          </button>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-12 w-12 text-amber-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">CRM Module Coming Soon</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Manage customer contacts, track interactions, and maintain relationships all in one place.
          </p>

          {/* Feature List */}
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <Phone className="h-8 w-8 text-amber-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Contact Management</h4>
              <p className="text-sm text-gray-600">Store and organize customer contact information</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <Mail className="h-8 w-8 text-amber-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Communication History</h4>
              <p className="text-sm text-gray-600">Track all interactions and conversations</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <MapPin className="h-8 w-8 text-amber-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Location Tracking</h4>
              <p className="text-sm text-gray-600">Map customer locations and service areas</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CRMPage;
