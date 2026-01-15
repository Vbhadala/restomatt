import React from 'react';
import { Calendar, Clock, User, CheckCircle2, Circle, Loader } from 'lucide-react';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isAdmin?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, isAdmin = false }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          label: 'Open',
          icon: <Circle className="h-4 w-4" />,
        };
      case 'working':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-700',
          label: 'Working',
          icon: <Loader className="h-4 w-4" />,
        };
      case 'closed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          label: 'Closed',
          icon: <CheckCircle2 className="h-4 w-4" />,
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          label: status,
          icon: <Circle className="h-4 w-4" />,
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

  const statusConfig = getStatusConfig(task.status);
  const overdue = isOverdue();

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer p-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base mb-1">{task.title}</h3>
          {isAdmin && (
            <div className="flex items-center text-xs text-gray-600 space-x-1">
              <User className="h-3 w-3" />
              <span>{task.assignedToName}</span>
            </div>
          )}
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusConfig.bg} ${statusConfig.text}`}
        >
          {statusConfig.icon}
          <span>{statusConfig.label}</span>
        </span>
      </div>

      {/* Details */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.details}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center space-x-1 text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
          <Calendar className="h-3 w-3" />
          <span>{formatDate(task.dueDate)}</span>
          {overdue && <span className="ml-1">(Overdue)</span>}
        </div>

        {task.notes.length > 0 && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{task.notes.length} {task.notes.length === 1 ? 'note' : 'notes'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
