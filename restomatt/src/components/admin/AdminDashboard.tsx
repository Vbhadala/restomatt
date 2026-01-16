import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  FileText,
  UserCheck,
  ClipboardList,
  Calendar,
  TrendingUp,
  ArrowRight,
  IndianRupee
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAllUsers, useAllProjects, useAllLeads, useAllTasks, useAllAttendance } from '../../hooks/useAdminData';
import { useProjectTypes } from '../../hooks/useProjectTypes';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { users, loading: usersLoading } = useAllUsers();
  const { projects, loading: projectsLoading } = useAllProjects();
  const { leads, loading: leadsLoading } = useAllLeads();
  const { tasks, loading: tasksLoading } = useAllTasks();
  const { attendance, loading: attendanceLoading } = useAllAttendance();
  const { projectTypes } = useProjectTypes();

  const loading = usersLoading || projectsLoading || leadsLoading || tasksLoading || attendanceLoading;

  // Calculate stats
  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.isAdmin).length;
  const totalProjects = projects.length;
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;
  const openTasks = tasks.filter(t => t.status === 'open').length;
  const workingTasks = tasks.filter(t => t.status === 'working').length;

  // Calculate total revenue from all projects
  const totalRevenue = projects.reduce((sum, project) => {
    const itemsTotal = project.items.reduce((acc, item) => acc + (item.amount || 0), 0);
    const extraCostsTotal = project.extraCosts.reduce((acc, cost) => acc + (cost.amount || 0), 0);
    return sum + itemsTotal + extraCostsTotal;
  }, 0);

  // Today's attendance
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayAttendance = attendance.filter(a => {
    const recordDate = new Date(a.date);
    recordDate.setHours(0, 0, 0, 0);
    return recordDate.getTime() === today.getTime();
  });
  const checkedInToday = todayAttendance.filter(a => a.status === 'checked-in' || a.status === 'checked-out').length;

  // Recent activity - projects from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentProjects = projects.filter(p => new Date(p.createdAt) >= sevenDaysAgo);

  const stats = [
    {
      name: 'Total Users',
      value: totalUsers,
      subtext: `${adminUsers} admin${adminUsers !== 1 ? 's' : ''}`,
      icon: Users,
      color: 'bg-blue-500',
      path: '/admin/users',
    },
    {
      name: 'Quotations',
      value: totalProjects,
      subtext: `${recentProjects.length} this week`,
      icon: FileText,
      color: 'bg-amber-500',
      path: '/admin/quotations',
    },
    {
      name: 'Leads',
      value: totalLeads,
      subtext: `${convertedLeads} converted`,
      icon: UserCheck,
      color: 'bg-green-500',
      path: '/admin/leads',
    },
    {
      name: 'Tasks',
      value: tasks.length,
      subtext: `${openTasks} open, ${workingTasks} in progress`,
      icon: ClipboardList,
      color: 'bg-purple-500',
      path: '/admin/tasks',
    },
    {
      name: 'Attendance Today',
      value: checkedInToday,
      subtext: `of ${totalUsers} users`,
      icon: Calendar,
      color: 'bg-indigo-500',
      path: '/admin/attendance',
    },
    {
      name: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      subtext: 'From all quotations',
      icon: IndianRupee,
      color: 'bg-emerald-500',
      path: '/admin/quotations',
    },
  ];

  // Get users with their project counts
  const userProjectCounts = users.map(user => ({
    user,
    projectCount: projects.filter(p => p.userId === user.id).length,
    leadCount: leads.filter(l => l.userId === user.id).length,
  })).sort((a, b) => b.projectCount - a.projectCount);

  // Get project type distribution
  const projectTypeDistribution = projectTypes.map(type => ({
    type,
    count: projects.filter(p => p.typeId === type.id).length,
  })).filter(t => t.count > 0).sort((a, b) => b.count - a.count);

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of all data across all users</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <button
                key={stat.name}
                onClick={() => navigate(stat.path)}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Users by Projects */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Top Users by Quotations</h2>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="text-sm text-amber-600 hover:text-amber-700 flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {userProjectCounts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No users found</p>
              ) : (
                <div className="space-y-4">
                  {userProjectCounts.slice(0, 5).map(({ user, projectCount, leadCount }) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <span className="text-amber-700 font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{projectCount}</p>
                        <p className="text-xs text-gray-500">{leadCount} leads</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Project Type Distribution */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Quotations by Type</h2>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              {projectTypeDistribution.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No quotations found</p>
              ) : (
                <div className="space-y-4">
                  {projectTypeDistribution.map(({ type, count }) => (
                    <div key={type.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{type.name}</span>
                        <span className="text-sm text-gray-500">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full"
                          style={{ width: `${(count / totalProjects) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Quotations</h2>
              <button
                onClick={() => navigate('/admin/quotations')}
                className="text-sm text-amber-600 hover:text-amber-700 flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {projects.slice(0, 5).map((project) => {
              const user = users.find(u => u.id === project.userId);
              const projectType = projectTypes.find(t => t.id === project.typeId);
              const totalAmount = project.items.reduce((sum, item) => sum + (item.amount || 0), 0) +
                project.extraCosts.reduce((sum, cost) => sum + (cost.amount || 0), 0);

              return (
                <div key={project.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-500">
                        {projectType?.name || 'Unknown Type'} &bull; {user?.name || 'Unknown User'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {projects.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No quotations found
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
