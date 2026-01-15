import React, { useState, useMemo } from 'react';
import { Calendar, Clock, TrendingUp, Plus, CalendarDays } from 'lucide-react';
import AppLayout from '../AppLayout/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { useAttendance } from '../../hooks/useAttendance';
import TodayStatusCard from './TodayStatusCard';
import AttendanceHistoryCard from './AttendanceHistoryCard';
import AddLeaveModal from './AddLeaveModal';

const AttendancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    attendanceRecords,
    todayRecord,
    loading,
    checkingIn,
    checkIn,
    checkOut,
    markAbsent,
    addLeave,
    getUpcomingLeaves
  } = useAttendance(currentUser?.id || '', currentUser?.name || 'User');

  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'all'>('month');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const handleCheckIn = async () => {
    try {
      await checkIn();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleMarkAbsent = async () => {
    try {
      await markAbsent();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleAddLeave = async (startDate: Date, endDate: Date, reason: string) => {
    try {
      await addLeave(startDate, endDate, reason);
    } catch (error: any) {
      alert(error.message);
      throw error;
    }
  };

  // Get upcoming leaves
  const upcomingLeaves = useMemo(() => {
    return getUpcomingLeaves();
  }, [attendanceRecords]);

  // Calculate days until leave
  const getDaysUntil = (date: Date): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === now.getMonth() &&
             recordDate.getFullYear() === now.getFullYear();
    });

    const totalDays = thisMonth.filter(r => r.status === 'checked-out').length;
    const totalHours = thisMonth.reduce((sum, record) => {
      return sum + (record.totalHours || 0);
    }, 0);
    const avgHours = totalDays > 0 ? totalHours / totalDays : 0;

    return {
      totalDays,
      totalHours: Math.round(totalHours * 10) / 10,
      avgHours: Math.round(avgHours * 10) / 10,
      thisMonth,
    };
  }, [attendanceRecords]);

  // Filter records based on selected period
  const filteredRecords = useMemo(() => {
    if (filterPeriod === 'all') return attendanceRecords;

    const now = new Date();
    const filterDate = new Date();

    if (filterPeriod === 'week') {
      filterDate.setDate(now.getDate() - 7);
    } else if (filterPeriod === 'month') {
      filterDate.setMonth(now.getMonth() - 1);
    }

    return attendanceRecords.filter(record => new Date(record.date) >= filterDate);
  }, [attendanceRecords, filterPeriod]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Attendance</h1>
            <p className="text-gray-600">Track your work hours and attendance</p>
          </div>
          {!loading && (
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Plan Leave</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading attendance data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Today's Status - Takes 1 column on desktop */}
            <div className="lg:col-span-1">
              <TodayStatusCard
                todayRecord={todayRecord}
                checkingIn={checkingIn}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                onMarkAbsent={handleMarkAbsent}
              />
            </div>

            {/* Stats - Takes 2 columns on desktop */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600">Days This Month</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalDays}</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600">Total Hours</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalHours}h</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600">Avg Hours/Day</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgHours}h</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Leaves Section */}
        {upcomingLeaves.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CalendarDays className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Leaves</h3>
            </div>

            <div className="space-y-3">
              {upcomingLeaves.slice(0, 5).map((leave) => {
                const daysUntil = getDaysUntil(leave.date);
                return (
                  <div
                    key={leave.id}
                    className="bg-white border border-purple-200 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-gray-900">
                          {new Date(leave.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      {leave.leaveReason && (
                        <p className="text-sm text-gray-600 ml-6">{leave.leaveReason}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-purple-600">
                        {daysUntil === 0 ? (
                          'Today'
                        ) : daysUntil === 1 ? (
                          'Tomorrow'
                        ) : (
                          `in ${daysUntil} days`
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* Attendance History */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Attendance History</h2>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFilterPeriod('week')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterPeriod === 'week'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setFilterPeriod('month')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterPeriod === 'month'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setFilterPeriod('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterPeriod === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* Desktop Table Header */}
          <div className="hidden md:grid md:grid-cols-12 md:gap-4 px-4 py-3 bg-gray-50 border border-gray-200 rounded-t-lg font-medium text-sm text-gray-600">
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Check-in</div>
            <div className="col-span-2">Check-out</div>
            <div className="col-span-1 text-center">Hours</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-3 text-right">Locations</div>
          </div>

          {/* History List */}
          {filteredRecords.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Attendance Records</h3>
              <p className="text-gray-600">
                {filterPeriod === 'week'
                  ? 'No attendance records for this week'
                  : filterPeriod === 'month'
                  ? 'No attendance records for this month'
                  : 'Start tracking your attendance by checking in'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRecords.map((record) => (
                <AttendanceHistoryCard key={record.id} record={record} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Leave Modal */}
      <AddLeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onAddLeave={handleAddLeave}
      />
    </AppLayout>
  );
};

export default AttendancePage;
