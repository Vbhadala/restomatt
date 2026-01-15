import React from 'react';
import { Star, Edit2, Trash2, Clock } from 'lucide-react';
import { DayActivity } from '../../types';

interface ActivityCardProps {
  activity: DayActivity;
  onEdit: (activity: DayActivity) => void;
  onDelete: (activityId: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onEdit,
  onDelete,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating === 3) return 'text-amber-600';
    return 'text-red-600';
  };

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-700';
    if (rating === 3) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      {/* Mobile Layout */}
      <div className="md:hidden p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-gray-900">{formatDate(activity.date)}</span>
              <span className="text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(activity.date)}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{activity.summary}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= activity.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(activity)}
              className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this activity?')) {
                  onDelete(activity.id);
                }
              }}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table-like Layout */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center p-4">
        {/* Date & Time - 2 cols */}
        <div className="col-span-2">
          <div className="font-semibold text-gray-900 text-sm">{formatDate(activity.date)}</div>
          <div className="text-xs text-gray-500 flex items-center mt-1">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(activity.date)}
          </div>
        </div>

        {/* Summary - 6 cols */}
        <div className="col-span-6">
          <p className="text-sm text-gray-700 line-clamp-2">{activity.summary}</p>
        </div>

        {/* Rating - 2 cols */}
        <div className="col-span-2 flex items-center justify-center">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= activity.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Actions - 2 cols */}
        <div className="col-span-2 flex items-center justify-end space-x-1">
          <button
            onClick={() => onEdit(activity)}
            className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit activity"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this activity?')) {
                onDelete(activity.id);
              }
            }}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete activity"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
