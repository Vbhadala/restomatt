import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle, Clock, AlertCircle, Edit3, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Milestone } from '../../types';

interface ProjectTimelineProps {
  milestones: Milestone[];
  onAddMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  onUpdateMilestone: (milestoneId: string, updates: Partial<Milestone>) => void;
  onDeleteMilestone: (milestoneId: string) => void;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  milestones,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
}) => {
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneDescription, setNewMilestoneDescription] = useState('');
  const [newMilestoneDueDate, setNewMilestoneDueDate] = useState('');
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  const sortedMilestones = [...milestones].sort((a, b) => a.order - b.order);

  const handleAddMilestone = () => {
    if (newMilestoneName.trim()) {
      const milestone: Omit<Milestone, 'id'> = {
        name: newMilestoneName.trim(),
        status: 'pending',
        order: sortedMilestones.length,
      };

      // Only add optional fields if they have values
      if (newMilestoneDescription.trim()) {
        milestone.description = newMilestoneDescription.trim();
      }

      if (newMilestoneDueDate) {
        milestone.dueDate = new Date(newMilestoneDueDate);
      }

      onAddMilestone(milestone);
      setNewMilestoneName('');
      setNewMilestoneDescription('');
      setNewMilestoneDueDate('');
      setIsAddingMilestone(false);
    }
  };

  const handleUpdateMilestone = () => {
    if (editingMilestone && editName.trim()) {
      const updates: Partial<Milestone> = {
        name: editName.trim(),
      };

      // Only add optional fields if they have values
      if (editDescription.trim()) {
        updates.description = editDescription.trim();
      }

      if (editDueDate) {
        updates.dueDate = new Date(editDueDate);
      }

      onUpdateMilestone(editingMilestone.id, updates);
      setEditingMilestone(null);
      setEditName('');
      setEditDescription('');
      setEditDueDate('');
    }
  };

  const handleStatusChange = (milestoneId: string, newStatus: Milestone['status']) => {
    const updates: Partial<Milestone> = {
      status: newStatus,
    };

    if (newStatus === 'completed' && !milestones.find(m => m.id === milestoneId)?.completedDate) {
      updates.completedDate = new Date();
    }
    // When changing to non-completed status, we don't need to explicitly set completedDate
    // The backend will handle clearing it properly

    onUpdateMilestone(milestoneId, updates);
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in-progress':
        return 'border-blue-200 bg-blue-50';
      case 'pending':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'No due date';

    // Handle different date formats from Firebase
    let dateObj: Date;
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date && typeof date === 'object' && 'toDate' in date && typeof (date as any).toDate === 'function') {
      // Firebase Timestamp
      dateObj = (date as any).toDate();
    } else {
      dateObj = new Date(date as any);
    }

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    return dateObj.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-amber-600" />
          Project Timeline & Milestones
        </h2>
        <button
          onClick={() => setIsAddingMilestone(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      <div className="p-6">
        {sortedMilestones.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No milestones yet</h3>
            <p className="text-gray-600 mb-4">Add milestones to track your project progress</p>
            <button
              onClick={() => setIsAddingMilestone(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add First Milestone</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedMilestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`border-l-4 ${getStatusColor(milestone.status)} rounded-r-lg p-4`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(milestone.status)}
                    </div>
                    <div className="flex-1">
                      {editingMilestone?.id === milestone.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="Milestone name"
                          />
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="Description (optional)"
                            rows={2}
                          />
                          <input
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={handleUpdateMilestone}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingMilestone(null)}
                              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-medium text-gray-900">{milestone.name}</h3>
                          {milestone.description && (
                            <p className="text-gray-600 mt-1">{milestone.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Due: {formatDate(milestone.dueDate)}</span>
                            {milestone.completedDate && (
                              <span>Completed: {formatDate(milestone.completedDate)}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-3">
                            <select
                              value={milestone.status}
                              onChange={(e) => handleStatusChange(milestone.id, e.target.value as Milestone['status'])}
                              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {editingMilestone?.id !== milestone.id && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingMilestone(milestone);
                          setEditName(milestone.name);
                          setEditDescription(milestone.description || '');
                          setEditDueDate(milestone.dueDate ? milestone.dueDate.toISOString().split('T')[0] : '');
                        }}
                        className="p-1 text-gray-400 hover:text-amber-600 transition-colors"
                        title="Edit milestone"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this milestone?')) {
                            onDeleteMilestone(milestone.id);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete milestone"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Milestone Modal/Form */}
        {isAddingMilestone && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Milestone</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Milestone Name *</label>
                  <input
                    type="text"
                    value={newMilestoneName}
                    onChange={(e) => setNewMilestoneName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter milestone name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newMilestoneDescription}
                    onChange={(e) => setNewMilestoneDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Describe this milestone"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newMilestoneDueDate}
                    onChange={(e) => setNewMilestoneDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddMilestone}
                  className="flex-1 bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition-colors"
                >
                  Add Milestone
                </button>
                <button
                  onClick={() => {
                    setIsAddingMilestone(false);
                    setNewMilestoneName('');
                    setNewMilestoneDescription('');
                    setNewMilestoneDueDate('');
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTimeline;
