import React, { useState, useEffect } from 'react';
import { X, Check, Star } from 'lucide-react';
import { DayActivity } from '../../types';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddActivity: (activity: {
    date: Date;
    summary: string;
    rating: 1 | 2 | 3 | 4 | 5;
  }) => void;
  editingActivity?: DayActivity | null;
}

const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  onClose,
  onAddActivity,
  editingActivity,
}) => {
  const [summary, setSummary] = useState('');
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(3);

  useEffect(() => {
    if (editingActivity) {
      setSummary(editingActivity.summary);
      setRating(editingActivity.rating);
    } else {
      setSummary('');
      setRating(3);
    }
  }, [editingActivity, isOpen]);

  const handleClose = () => {
    setSummary('');
    setRating(3);
    onClose();
  };

  const handleSubmit = () => {
    if (summary.trim()) {
      onAddActivity({
        date: editingActivity ? editingActivity.date : new Date(),
        summary: summary.trim(),
        rating,
      });
      handleClose();
    }
  };

  const canSubmit = summary.trim().length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingActivity ? 'Edit Activity' : 'Add Daily Activity'}
            </h2>
            <p className="text-sm text-gray-500">
              {editingActivity ? 'Update your daily activity' : 'Record what you accomplished today'}
            </p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary */}
          <div>
            <label htmlFor="activity-summary" className="block text-sm font-medium text-gray-700 mb-2">
              Summary *
            </label>
            <textarea
              id="activity-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="What did you accomplish today? E.g., Completed kitchen project, met with 3 clients..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How was your day? *
            </label>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value as 1 | 2 | 3 | 4 | 5)}
                  className={`p-2 rounded-lg transition-all ${
                    rating >= value
                      ? 'text-amber-500 scale-110'
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  <Star
                    className={`h-8 w-8 ${rating >= value ? 'fill-amber-500' : ''}`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              {rating === 1 && 'Challenging day'}
              {rating === 2 && 'Could be better'}
              {rating === 3 && 'Average day'}
              {rating === 4 && 'Good day'}
              {rating === 5 && 'Excellent day!'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              canSubmit
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check className="h-4 w-4" />
            <span>{editingActivity ? 'Update' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddActivityModal;
