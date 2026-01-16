import React, { useState, useMemo } from 'react';
import {
  Search,
  User,
  Calendar,
  Eye,
  Trash2,
  ChevronDown,
  Clock,
  MessageSquare,
  ClipboardList,
  CheckCircle,
  Circle,
  PlayCircle
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAllUsers, useAllTasks } from '../../hooks/useAdminData';
import toast from 'react-hot-toast';
import { Task, TaskStatus } from '../../types';

const statusConfig: Record<TaskStatus, { color: string; icon: React.FC<{ className?: string }> }> = {
  open: { color: 'bg-blue-100 text-blue-700', icon: Circle },
  working: { color: 'bg-yellow-100 text-yellow-700', icon: PlayCircle },
  closed: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

const AdminTasksPage: React.FC = () => {
  const { users, loading: usersLoading } = useAllUsers();
  const { tasks, loading: tasksLoading, deleteTask } = useAllTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const loading = usersLoading || tasksLoading;

  const allStatuses: TaskStatus[] = ['open', 'working', 'closed'];

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedToName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesUser =
        filterUser === 'all' ||
        task.assignedToId === filterUser ||
        task.assignedById === filterUser;

      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;

      return matchesSearch && matchesUser && matchesStatus;
    });
  }, [tasks, searchQuery, filterUser, filterStatus]);

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully');
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  // Stats by status
  const statusStats = allStatuses.map(status => ({
    status,
    count: tasks.filter(t => t.status === status).length,
  }));

  const isOverdue = (task: Task) => {
    return task.status !== 'closed' && new Date(task.dueDate) < new Date();
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
            <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
            <p className="text-gray-600">View and manage tasks across all users</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {statusStats.map(({ status, count }) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              return (
                <span key={status} className={`${config.color} px-3 py-1 rounded-full flex items-center space-x-1`}>
                  <Icon className="h-4 w-4" />
                  <span className="capitalize">{status}: {count}</span>
                </span>
              );
            })}
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
                placeholder="Search by title, details, or assignee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                  <option key={status} value={status} className="capitalize">{status}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredTasks.map((task) => {
              const config = statusConfig[task.status];
              const StatusIcon = config.icon;
              const overdue = isOverdue(task);

              return (
                <div key={task.id} className={`p-5 hover:bg-gray-50 ${overdue ? 'bg-red-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Status Icon */}
                      <div className={`mt-1 ${config.color} p-2 rounded-lg`}>
                        <StatusIcon className="h-5 w-5" />
                      </div>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          {overdue && (
                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                              Overdue
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{task.details}</p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>Assigned to: <span className="text-gray-700">{task.assignedToName}</span></span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>By: <span className="text-gray-700">{task.assignedByName}</span></span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span className={overdue ? 'text-red-600 font-medium' : ''}>
                              Due: {new Date(task.dueDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{task.notes.length} notes</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(task.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTasks.length === 0 && (
            <div className="p-12 text-center">
              <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Task?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. All notes associated with this task will be permanently deleted.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTask(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Details Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-bold text-gray-900">{selectedTask.title}</h2>
                      <span className={`${statusConfig[selectedTask.status].color} px-2 py-1 rounded-full text-xs font-medium capitalize`}>
                        {selectedTask.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-2xl leading-none"
                  >
                    &times;
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Task Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedTask.details}</p>
                </div>

                {/* Assignment Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Assignment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Assigned To</p>
                      <p className="text-gray-900">{selectedTask.assignedToName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Assigned By</p>
                      <p className="text-gray-900">{selectedTask.assignedByName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Due Date</p>
                      <p className={isOverdue(selectedTask) ? 'text-red-600 font-medium' : 'text-gray-900'}>
                        {new Date(selectedTask.dueDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                        {isOverdue(selectedTask) && ' (Overdue)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="text-gray-900 capitalize">{selectedTask.status}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Notes ({selectedTask.notes.length})
                  </h3>
                  {selectedTask.notes.length > 0 ? (
                    <div className="space-y-3">
                      {selectedTask.notes.map((note) => (
                        <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-900">{note.note}</p>
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                            <span>By {note.createdByName}</span>
                            <span>
                              {new Date(note.createdAt).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No notes added</p>
                  )}
                </div>

                {/* Meta Info */}
                <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
                  <p>Created: {new Date(selectedTask.createdAt).toLocaleString('en-IN')}</p>
                  <p>Last updated: {new Date(selectedTask.updatedAt).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTasksPage;
