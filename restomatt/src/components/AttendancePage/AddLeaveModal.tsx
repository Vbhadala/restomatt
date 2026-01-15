import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';

interface AddLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLeave: (startDate: Date, endDate: Date, reason: string) => Promise<void>;
}

const AddLeaveModal: React.FC<AddLeaveModalProps> = ({ isOpen, onClose, onAddLeave }) => {
  // Get tomorrow's date as default
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getTomorrowDate());
  const [endDate, setEndDate] = useState(getTomorrowDate());
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Update end date when start date changes (if end date is before new start date)
  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);
    if (endDate && newStartDate > endDate) {
      setEndDate(newStartDate);
    }
  };

  const handleClose = () => {
    const tomorrow = getTomorrowDate();
    setStartDate(tomorrow);
    setEndDate(tomorrow);
    setReason('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate || !reason.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start date must be greater than today (not equal)
    if (start <= today) {
      setError('Start date must be after today');
      return;
    }

    // End date must be greater than or equal to start date
    if (end < start) {
      setError('End date must be equal to or after start date');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddLeave(start, end, reason.trim());
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add leave');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Plan Leave</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              min={getTomorrowDate()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isSubmitting}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Must be after today</p>
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || getTomorrowDate()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isSubmitting}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Must be equal to or after start date</p>
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Leave Reason
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Family vacation, Medical appointment, Personal matters..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Date Range Info */}
          {startDate && endDate && new Date(startDate) <= new Date(endDate) && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-800">
                <span className="font-medium">
                  {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} day(s)
                </span>
                {' '}will be marked as leave
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Leave'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeaveModal;
