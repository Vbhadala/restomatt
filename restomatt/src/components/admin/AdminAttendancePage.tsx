import React, { useState, useMemo } from 'react';
import {
  Search,
  User,
  Calendar,
  ChevronDown,
  Clock,
  MapPin,
  CalendarDays,
  ExternalLink
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAllUsers, useAllAttendance } from '../../hooks/useAdminData';
import { GeoLocation } from '../../types';

// Helper to generate Google Maps URL from coordinates
const getGoogleMapsUrl = (location: GeoLocation) => {
  return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
};

const statusColors: Record<string, string> = {
  'checked-in': 'bg-green-100 text-green-700',
  'checked-out': 'bg-blue-100 text-blue-700',
  'absent': 'bg-red-100 text-red-700',
  'leave': 'bg-yellow-100 text-yellow-700',
};

const AdminAttendancePage: React.FC = () => {
  const { users, loading: usersLoading } = useAllUsers();
  const { attendance, loading: attendanceLoading } = useAllAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  const loading = usersLoading || attendanceLoading;

  const allStatuses = ['checked-in', 'checked-out', 'absent', 'leave'];

  // Filter and search attendance
  const filteredAttendance = useMemo(() => {
    return attendance.filter(record => {
      const matchesSearch =
        record.userName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesUser = filterUser === 'all' || record.userId === filterUser;
      const matchesStatus = filterStatus === 'all' || record.status === filterStatus;

      let matchesDate = true;
      if (filterDate) {
        const recordDate = new Date(record.date);
        const filterDateObj = new Date(filterDate);
        matchesDate = recordDate.toDateString() === filterDateObj.toDateString();
      }

      return matchesSearch && matchesUser && matchesStatus && matchesDate;
    });
  }, [attendance, searchQuery, filterUser, filterStatus, filterDate]);

  // Stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRecords = attendance.filter(a => {
    const recordDate = new Date(a.date);
    recordDate.setHours(0, 0, 0, 0);
    return recordDate.getTime() === today.getTime();
  });

  const formatTime = (date: Date | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
            <p className="text-gray-600">View attendance records for all users</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Today: {todayRecords.filter(a => a.status === 'checked-in' || a.status === 'checked-out').length} Present
            </span>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
              {todayRecords.filter(a => a.status === 'leave').length} On Leave
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              />
            </div>

            {/* User Filter */}
            <div className="relative">
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              >
                <option value="all">All Users</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              >
                <option value="all">All Statuses</option>
                {allStatuses.map(status => (
                  <option key={status} value={status} className="capitalize">{status.replace('-', ' ')}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">{record.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {new Date(record.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${statusColors[record.status]} px-2 py-1 rounded-full text-xs font-medium capitalize`}>
                        {record.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-gray-900">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{formatTime(record.checkInTime)}</span>
                      </div>
                      {record.checkInLocation && (
                        <a
                          href={getGoogleMapsUrl(record.checkInLocation)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-amber-600 hover:text-amber-700 mt-1"
                        >
                          <MapPin className="h-3 w-3" />
                          <span>View Location</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-gray-900">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{formatTime(record.checkOutTime)}</span>
                      </div>
                      {record.checkOutLocation && (
                        <a
                          href={getGoogleMapsUrl(record.checkOutLocation)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-amber-600 hover:text-amber-700 mt-1"
                        >
                          <MapPin className="h-3 w-3" />
                          <span>View Location</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">
                        {record.totalHours ? `${record.totalHours.toFixed(1)} hrs` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm">
                        {record.leaveReason || record.notes || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAttendance.length === 0 && (
            <div className="p-12 text-center">
              <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAttendancePage;
