import React from 'react';
import { BookOpen, Plus, Calendar, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AppLayout from '../AppLayout/AppLayout';

const DayBookPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">DayBook</h1>
          <p className="text-gray-600">Track daily transactions and manage your accounts</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">Today</span>
            </div>
          </div>

          <button className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">DayBook Module Coming Soon</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Track daily income and expenses, manage cash flow, and generate financial reports.
          </p>

          {/* Feature List */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <ArrowUpRight className="h-8 w-8 text-green-600" />
                <h4 className="font-semibold text-gray-900">Income Tracking</h4>
              </div>
              <p className="text-sm text-gray-600">Record all income transactions and payments received</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <ArrowDownRight className="h-8 w-8 text-red-600" />
                <h4 className="font-semibold text-gray-900">Expense Management</h4>
              </div>
              <p className="text-sm text-gray-600">Track all expenses and operational costs</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Financial Reports</h4>
              </div>
              <p className="text-sm text-gray-600">Generate detailed profit and loss statements</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DayBookPage;
