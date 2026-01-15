import React from 'react';
import { Calendar, Plus, UserCheck, UserX, Clock, BarChart3 } from 'lucide-react';
import AppLayout from '../AppLayout/AppLayout';

const AttendancePage: React.FC = () => {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Attendance Management</h1>
          <p className="text-gray-600">Track employee attendance and work hours</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">This Week</span>
            </div>
          </div>

          <button className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Mark Attendance</span>
          </button>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Attendance Module Coming Soon</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Track employee attendance, work hours, leaves, and generate attendance reports.
          </p>

          {/* Feature List */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <UserCheck className="h-8 w-8 text-green-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Daily Attendance</h4>
              <p className="text-sm text-gray-600">Mark daily check-in and check-out for employees</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <Clock className="h-8 w-8 text-blue-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Work Hours Tracking</h4>
              <p className="text-sm text-gray-600">Monitor total hours worked and overtime</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <BarChart3 className="h-8 w-8 text-purple-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Attendance Reports</h4>
              <p className="text-sm text-gray-600">Generate monthly attendance and leave reports</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AttendancePage;
