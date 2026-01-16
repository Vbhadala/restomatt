import React, { useState, useMemo } from 'react';
import {
  Search,
  User,
  Calendar,
  ChevronDown,
  Star,
  BookOpen
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAllUsers, useAllDayActivities } from '../../hooks/useAdminData';

const AdminDayBookPage: React.FC = () => {
  const { users, loading: usersLoading } = useAllUsers();
  const { activities, loading: activitiesLoading } = useAllDayActivities();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  const loading = usersLoading || activitiesLoading;

  // Filter and search activities
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const user = users.find(u => u.id === activity.userId);
      const matchesSearch =
        activity.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesUser = filterUser === 'all' || activity.userId === filterUser;
      const matchesRating = filterRating === 'all' || activity.rating.toString() === filterRating;

      let matchesDate = true;
      if (filterDate) {
        const activityDate = new Date(activity.date);
        const filterDateObj = new Date(filterDate);
        matchesDate = activityDate.toDateString() === filterDateObj.toDateString();
      }

      return matchesSearch && matchesUser && matchesRating && matchesDate;
    });
  }, [activities, users, searchQuery, filterUser, filterRating, filterDate]);

  // Stats
  const avgRating = activities.length > 0
    ? (activities.reduce((sum, a) => sum + a.rating, 0) / activities.length).toFixed(1)
    : '0';

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
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
            <h1 className="text-2xl font-bold text-gray-900">Day Book</h1>
            <p className="text-gray-600">View daily activity summaries from all users</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full flex items-center space-x-1">
              <Star className="h-4 w-4 fill-amber-500" />
              <span>Avg Rating: {avgRating}</span>
            </span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {activities.length} Entries
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
                placeholder="Search by summary or user..."
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

            {/* Rating Filter */}
            <div className="relative">
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              >
                <option value="all">All Ratings</option>
                {[5, 4, 3, 2, 1].map(rating => (
                  <option key={rating} value={rating}>{rating} Stars</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActivities.map((activity) => {
            const user = users.find(u => u.id === activity.userId);

            return (
              <div key={activity.id} className="bg-white rounded-xl shadow-sm p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.name || 'Unknown'}</p>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(activity.date).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  {renderStars(activity.rating)}
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{activity.summary}</p>
                </div>

                {/* Meta */}
                <div className="mt-3 text-xs text-gray-500">
                  Created: {new Date(activity.createdAt).toLocaleString('en-IN')}
                </div>
              </div>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No day book entries found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDayBookPage;
