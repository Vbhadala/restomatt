import React, { useState } from 'react';
import { X, Calendar, User, Clock, MessageCircle, Send, CheckCircle2, Circle, Loader } from 'lucide-react';
import { Task, TaskStatus } from '../../types';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onAddNote: (taskId: string, noteText: string) => void;
  currentUserName: string;
  isAdmin: boolean;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  isOpen,
  onClose,
  onStatusChange,
  onAddNote,
  currentUserName,
  isAdmin,
}) => {
  const [noteText, setNoteText] = useState('');

  if (!isOpen || !task) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatNoteDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          border: 'border-blue-200',
          label: 'Open',
          icon: <Circle className="h-5 w-5" />,
        };
      case 'working':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-700',
          border: 'border-amber-200',
          label: 'Working',
          icon: <Loader className="h-5 w-5" />,
        };
      case 'closed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-200',
          label: 'Closed',
          icon: <CheckCircle2 className="h-5 w-5" />,
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-200',
          label: status,
          icon: <Circle className="h-5 w-5" />,
        };
    }
  };

  const isOverdue = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today && task.status !== 'closed';
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote(task.id, noteText.trim());
      setNoteText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  const statusConfig = getStatusConfig(task.status);
  const overdue = isOverdue();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Assigned to: <span className="font-medium">{task.assignedToName}</span></span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Created by: <span className="font-medium">{task.assignedByName}</span></span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Status</h3>
            <div className="flex items-center space-x-3">
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                disabled={isAdmin}
                className={`px-4 py-2 rounded-lg border font-medium flex-1 max-w-xs ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} ${
                  isAdmin ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:opacity-80'
                }`}
              >
                <option value="open">Open</option>
                <option value="working">Working</option>
                <option value="closed">Closed</option>
              </select>
              {isAdmin && (
                <span className="text-xs text-gray-500 italic">Only assignee can change status</span>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Due Date</h3>
            <div className={`flex items-center space-x-2 ${overdue ? 'text-red-600' : 'text-gray-900'}`}>
              <Calendar className="h-5 w-5" />
              <span className="font-medium">{formatDate(task.dueDate)}</span>
              {overdue && (
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  Overdue
                </span>
              )}
            </div>
          </div>

          {/* Task Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Task Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-900 whitespace-pre-wrap">{task.details}</p>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Progress Notes</h3>
              <span className="text-xs text-gray-500">{task.notes.length} {task.notes.length === 1 ? 'note' : 'notes'}</span>
            </div>

            {/* Add Note Input */}
            <div className="mb-4">
              <div className="flex space-x-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a progress note... (Press Enter to send, Shift+Enter for new line)"
                  rows={2}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!noteText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {task.notes.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No progress notes yet</p>
                  <p className="text-gray-500 text-xs mt-1">Add notes to track your progress</p>
                </div>
              ) : (
                [...task.notes].reverse().map((note) => (
                  <div
                    key={note.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {note.createdByName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{note.createdByName}</p>
                          <div className="flex items-center text-xs text-gray-500 space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatNoteDate(note.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap ml-10">{note.note}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
