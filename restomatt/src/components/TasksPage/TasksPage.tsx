import React, { useState, useMemo } from 'react';
import { ClipboardList, Plus, Filter } from 'lucide-react';
import AppLayout from '../AppLayout/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { useTask } from '../../hooks/useTask';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import TaskDetailsModal from './TaskDetailsModal';
import { Task, TaskStatus } from '../../types';

const TasksPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { tasks, loading, submitting, createTask, updateTaskStatus, addTaskNote } = useTask(
    currentUser?.id || '',
    currentUser?.isAdmin || false
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | TaskStatus>('all');

  const handleCreateTask = async (
    title: string,
    details: string,
    dueDate: Date,
    assignedToId: string,
    assignedToName: string
  ) => {
    try {
      await createTask(title, details, dueDate, assignedToId, assignedToName, currentUser?.name || 'Admin');
    } catch (error: any) {
      alert(error.message);
      throw error;
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, status);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleAddNote = async (taskId: string, noteText: string) => {
    try {
      await addTaskNote(taskId, noteText, currentUser?.name || 'User');
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Filter tasks based on status
  const filteredTasks = useMemo(() => {
    if (filterStatus === 'all') return tasks;
    return tasks.filter(task => task.status === filterStatus);
  }, [tasks, filterStatus]);

  // Separate tasks by status for admin view
  const tasksByStatus = useMemo(() => {
    return {
      open: tasks.filter(t => t.status === 'open'),
      working: tasks.filter(t => t.status === 'working'),
      closed: tasks.filter(t => t.status === 'closed'),
    };
  }, [tasks]);

  // Count overdue tasks
  const overdueTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter(task => {
      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);
      return due < today && task.status !== 'closed';
    }).length;
  }, [tasks]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Tasks</h1>
            <p className="text-gray-600">
              {currentUser?.isAdmin ? 'Manage and assign tasks to team members' : 'View and update your assigned tasks'}
            </p>
          </div>
          {!loading && currentUser?.isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Create Task</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading tasks...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <ClipboardList className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Total Tasks</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ClipboardList className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Open</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{tasksByStatus.open.length}</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <ClipboardList className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{tasksByStatus.working.length}</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ClipboardList className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{overdueTasks}</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1 inline-flex">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Tasks
                </button>
                <button
                  onClick={() => setFilterStatus('open')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === 'open'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => setFilterStatus('working')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === 'working'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Working
                </button>
                <button
                  onClick={() => setFilterStatus('closed')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === 'closed'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Closed
                </button>
              </div>
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Found</h3>
                <p className="text-gray-600">
                  {filterStatus === 'all'
                    ? currentUser?.isAdmin
                      ? 'Create your first task to get started'
                      : 'No tasks have been assigned to you yet'
                    : `No ${filterStatus} tasks found`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => setSelectedTask(task)}
                    isAdmin={currentUser?.isAdmin || false}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={handleCreateTask}
      />

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onStatusChange={handleStatusChange}
        onAddNote={handleAddNote}
        currentUserName={currentUser?.name || 'User'}
        isAdmin={currentUser?.isAdmin || false}
      />
    </AppLayout>
  );
};

export default TasksPage;
