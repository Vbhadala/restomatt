import React, { useState, useMemo } from 'react';
import {
  Search,
  Shield,
  ShieldOff,
  Mail,
  FileText,
  UserCheck,
  MoreVertical,
  User,
  Filter
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAllUsers, useAllProjects, useAllLeads } from '../../hooks/useAdminData';
import toast from 'react-hot-toast';

const AdminUsersPage: React.FC = () => {
  const { users, loading: usersLoading, toggleAdminStatus } = useAllUsers();
  const { projects, loading: projectsLoading } = useAllProjects();
  const { leads, loading: leadsLoading } = useAllLeads();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const loading = usersLoading || projectsLoading || leadsLoading;

  // Calculate user stats
  const userStats = useMemo(() => {
    return users.map(user => ({
      user,
      projectCount: projects.filter(p => p.userId === user.id).length,
      leadCount: leads.filter(l => l.userId === user.id).length,
      totalRevenue: projects
        .filter(p => p.userId === user.id)
        .reduce((sum, project) => {
          const itemsTotal = project.items.reduce((acc, item) => acc + (item.amount || 0), 0);
          const extraCostsTotal = project.extraCosts.reduce((acc, cost) => acc + (cost.amount || 0), 0);
          return sum + itemsTotal + extraCostsTotal;
        }, 0),
    }));
  }, [users, projects, leads]);

  // Filter users
  const filteredUsers = useMemo(() => {
    return userStats.filter(({ user }) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        filterRole === 'all' ||
        (filterRole === 'admin' && user.isAdmin) ||
        (filterRole === 'user' && !user.isAdmin);

      return matchesSearch && matchesRole;
    });
  }, [userStats, searchQuery, filterRole]);

  const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    try {
      await toggleAdminStatus(userId, !currentIsAdmin);
      toast.success(currentIsAdmin ? 'Admin rights removed' : 'Admin rights granted');
      setSelectedUserId(null);
    } catch (error) {
      toast.error('Failed to update user role');
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600">Manage all users and their permissions</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {users.length} Total
            </span>
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
              {users.filter(u => u.isAdmin).length} Admins
            </span>
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
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'user')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="admin">Admins Only</option>
                <option value="user">Regular Users</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(({ user, projectCount, leadCount, totalRevenue }) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm p-6 relative">
              {/* Actions Menu */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSelectedUserId(selectedUserId === user.id ? null : user.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>

                {selectedUserId === user.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                        user.isAdmin ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {user.isAdmin ? (
                        <>
                          <ShieldOff className="h-4 w-4" />
                          <span>Remove Admin</span>
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4" />
                          <span>Make Admin</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  user.isAdmin ? 'bg-amber-100' : 'bg-gray-100'
                }`}>
                  <User className={`h-7 w-7 ${user.isAdmin ? 'text-amber-700' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                    {user.isAdmin && (
                      <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
                    <FileText className="h-4 w-4" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{projectCount}</p>
                  <p className="text-xs text-gray-500">Quotations</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{leadCount}</p>
                  <p className="text-xs text-gray-500">Leads</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{totalRevenue >= 100000
                      ? `${(totalRevenue / 100000).toFixed(1)}L`
                      : totalRevenue >= 1000
                        ? `${(totalRevenue / 1000).toFixed(0)}K`
                        : totalRevenue.toLocaleString('en-IN')
                    }
                  </p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
