import React, { useState } from 'react';
import { BookOpen, Plus, Calendar, Star, TrendingUp } from 'lucide-react';
import AppLayout from '../AppLayout/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { useDayBook } from '../../hooks/useDayBook';
import AddActivityModal from './AddActivityModal';
import ActivityCard from './ActivityCard';
import { DayActivity } from '../../types';

const DayBookPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { activities, loading, addActivity, updateActivity, deleteActivity } = useDayBook(currentUser?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<DayActivity | null>(null);

  const handleAddActivity = async (activityData: {
    date: Date;
    summary: string;
    rating: 1 | 2 | 3 | 4 | 5;
  }) => {
    try {
      if (editingActivity) {
        await updateActivity(editingActivity.id, activityData);
        setEditingActivity(null);
      } else {
        await addActivity(activityData);
      }
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving activity:', error);
      alert('Failed to save activity. Please try again.');
    }
  };

  const handleEdit = (activity: DayActivity) => {
    setEditingActivity(activity);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (activityId: string) => {
    try {
      await deleteActivity(activityId);
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Failed to delete activity. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingActivity(null);
  };

  // Calculate statistics
  const averageRating = activities.length > 0
    ? activities.reduce((sum, activity) => sum + activity.rating, 0) / activities.length
    : 0;

  const thisMonthActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    const now = new Date();
    return activityDate.getMonth() === now.getMonth() && activityDate.getFullYear() === now.getFullYear();
  });

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">DayBook</h1>
          <p className="text-gray-600">Track your daily activities and reflect on your progress</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Activities</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{activities.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {averageRating > 0 ? averageRating.toFixed(1) : '0.0'} / 5
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">This Month</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{thisMonthActivities.length}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Activity</span>
          </button>
        </div>

        {/* Activities List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activities Yet</h3>
            <p className="text-gray-600 mb-6">
              Start tracking your daily activities and reflect on your progress
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Your First Activity</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Activity Modal */}
      <AddActivityModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onAddActivity={handleAddActivity}
        editingActivity={editingActivity}
      />
    </AppLayout>
  );
};

export default DayBookPage;
