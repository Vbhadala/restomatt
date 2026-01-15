import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plane
} from 'lucide-react';
import AppLayout from '../AppLayout/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { useProjects } from '../../hooks/useProjects';
import { useTask } from '../../hooks/useTask';
import { useAttendance } from '../../hooks/useAttendance';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { projects, loading: projectsLoading } = useProjects(currentUser?.id || '');
  const { tasks, loading: tasksLoading } = useTask(
    currentUser?.id || '',
    currentUser?.isAdmin || false
  );
  const { getUpcomingLeaves, loading: attendanceLoading } = useAttendance(
    currentUser?.id || '',
    currentUser?.name || 'User'
  );

  // Get upcoming leaves
  const upcomingLeaves = useMemo(() => {
    return getUpcomingLeaves().slice(0, 5);
  }, [getUpcomingLeaves]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalQuotations = projects.length;
    const totalValue = projects.reduce((sum, project) => {
      const itemsTotal = project.items?.reduce((itemSum, item) => itemSum + (item.amount || 0), 0) || 0;
      const extrasTotal = project.extraCosts?.reduce((extraSum, extra) => extraSum + (extra.amount || 0), 0) || 0;
      return sum + itemsTotal + extrasTotal;
    }, 0);

    const openTasks = tasks.filter(t => t.status === 'open').length;
    const workingTasks = tasks.filter(t => t.status === 'working').length;
    const overdueTasks = tasks.filter(t => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      return due < today && t.status !== 'closed';
    }).length;

    return {
      totalQuotations,
      totalValue,
      totalTasks: tasks.length,
      openTasks,
      workingTasks,
      overdueTasks,
    };
  }, [projects, tasks]);

  // Get recent activity
  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [projects]);

  const upcomingTasks = useMemo(() => {
    return [...tasks]
      .filter(t => t.status !== 'closed')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [tasks]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const isOverdue = (dueDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const formatDateRange = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (projectsLoading || tasksLoading || attendanceLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your business today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Quotations */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Quotations</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalQuotations}</p>
          </div>

          {/* Total Value */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Value</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
          </div>

          {/* Active Tasks */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <ClipboardList className="h-6 w-6 text-amber-600" />
              </div>
              {stats.overdueTasks > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  {stats.overdueTasks} overdue
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Tasks</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.openTasks + stats.workingTasks}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 p-6">
            <p className="text-sm font-medium text-amber-900 mb-4">Quick Actions</p>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/app/quotations')}
                className="w-full text-left px-3 py-2 bg-white rounded-md text-sm text-gray-700 hover:bg-amber-50 transition-colors"
              >
                New Quotation
              </button>
              <button
                onClick={() => navigate('/app/crm')}
                className="w-full text-left px-3 py-2 bg-white rounded-md text-sm text-gray-700 hover:bg-amber-50 transition-colors"
              >
                Add Lead
              </button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Quotations */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Quotations</h2>
              <button
                onClick={() => navigate('/app/quotations')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No quotations yet</p>
                <button
                  onClick={() => navigate('/app/quotations')}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first quotation
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => {
                  const itemsTotal = project.items?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
                  const extrasTotal = project.extraCosts?.reduce((sum, extra) => sum + (extra.amount || 0), 0) || 0;
                  const total = itemsTotal + extrasTotal;

                  return (
                    <div
                      key={project.id}
                      onClick={() => navigate('/app/quotations')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-600">{project.customerName || 'No customer'}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(total)}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(project.createdAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
              <button
                onClick={() => navigate('/app/tasks')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">All caught up!</p>
                <p className="text-gray-500 text-xs mt-1">No pending tasks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => {
                  const overdue = isOverdue(task.dueDate);
                  return (
                    <div
                      key={task.id}
                      onClick={() => navigate('/app/tasks')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Assigned to: {task.assignedToName}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            task.status === 'open'
                              ? 'bg-blue-100 text-blue-700'
                              : task.status === 'working'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {task.status === 'open' ? 'Open' : task.status === 'working' ? 'Working' : 'Closed'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {overdue ? (
                          <div className="flex items-center text-xs text-red-600">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Overdue - {formatDate(task.dueDate)}
                          </div>
                        ) : (
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            Due {formatDate(task.dueDate)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Leaves */}
        {upcomingLeaves.length > 0 && (
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Plane className="h-5 w-5 text-blue-600" />
                <span>Upcoming Leaves</span>
              </h2>
              <button
                onClick={() => navigate('/app/attendance')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  onClick={() => navigate('/app/attendance')}
                  className="p-4 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-200 rounded-lg">
                        <Plane className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{formatDateRange(leave.date)}</p>
                        {leave.leaveReason && (
                          <p className="text-sm text-gray-600 mt-1">{leave.leaveReason}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module Quick Links */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/app/quotations')}
            className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all text-center group"
          >
            <div className="p-3 bg-blue-100 rounded-lg inline-flex mb-3 group-hover:bg-blue-200 transition-colors">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Quotations</p>
          </button>

          <button
            onClick={() => navigate('/app/crm')}
            className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all text-center group"
          >
            <div className="p-3 bg-purple-100 rounded-lg inline-flex mb-3 group-hover:bg-purple-200 transition-colors">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">CRM</p>
          </button>

          <button
            onClick={() => navigate('/app/daybook')}
            className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all text-center group"
          >
            <div className="p-3 bg-green-100 rounded-lg inline-flex mb-3 group-hover:bg-green-200 transition-colors">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">DayBook</p>
          </button>

          <button
            onClick={() => navigate('/app/attendance')}
            className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all text-center group"
          >
            <div className="p-3 bg-orange-100 rounded-lg inline-flex mb-3 group-hover:bg-orange-200 transition-colors">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Attendance</p>
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default HomePage;
