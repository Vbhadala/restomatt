import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  FileText,
  User,
  Calendar,
  Eye,
  Trash2,
  ChevronDown,
  Package,
  IndianRupee
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAllUsers, useAllProjects } from '../../hooks/useAdminData';
import { useProjectTypes } from '../../hooks/useProjectTypes';
import toast from 'react-hot-toast';
import { Project } from '../../types';

const AdminQuotationsPage: React.FC = () => {
  const { users, loading: usersLoading } = useAllUsers();
  const { projects, loading: projectsLoading, deleteProject } = useAllProjects();
  const { projectTypes, loading: typesLoading } = useProjectTypes();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const loading = usersLoading || projectsLoading || typesLoading;

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.customerMobile?.includes(searchQuery);

      const matchesUser = filterUser === 'all' || project.userId === filterUser;
      const matchesType = filterType === 'all' || project.typeId === filterType;

      return matchesSearch && matchesUser && matchesType;
    });
  }, [projects, searchQuery, filterUser, filterType]);

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      toast.success('Quotation deleted successfully');
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete quotation');
    }
  };

  const getProjectTotal = (project: Project) => {
    const itemsTotal = project.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const extraCostsTotal = project.extraCosts.reduce((sum, cost) => sum + (cost.amount || 0), 0);
    return itemsTotal + extraCostsTotal;
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
            <h1 className="text-2xl font-bold text-gray-900">All Quotations</h1>
            <p className="text-gray-600">View and manage quotations from all users</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
              {projects.length} Total
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
              ₹{projects.reduce((sum, p) => sum + getProjectTotal(p), 0).toLocaleString('en-IN')}
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
                placeholder="Search by name, customer, or mobile..."
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

            {/* Type Filter */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              >
                <option value="all">All Types</option>
                {projectTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quotation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProjects.map((project) => {
                  const user = users.find(u => u.id === project.userId);
                  const projectType = projectTypes.find(t => t.id === project.typeId);
                  const total = getProjectTotal(project);

                  return (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-amber-100 p-2 rounded-lg">
                            <FileText className="h-5 w-5 text-amber-700" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{project.name}</p>
                            <p className="text-xs text-gray-500">ID: {project.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{project.customerName || '-'}</p>
                        <p className="text-xs text-gray-500">{project.customerMobile || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="text-gray-900">{user?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {projectType?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{project.items.length}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-gray-900">
                            {total.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(project.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: '2-digit',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedProject(project)}
                            className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(project.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quotations found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Quotation?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. All items, costs, and photos associated with this quotation will be permanently deleted.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProject(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Project Details Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedProject.name}</h2>
                    <p className="text-gray-600">
                      {projectTypes.find(t => t.id === selectedProject.typeId)?.name || 'Unknown Type'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <span className="sr-only">Close</span>
                    &times;
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="text-gray-900">{selectedProject.customerName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Mobile</p>
                      <p className="text-gray-900">{selectedProject.customerMobile || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Address</p>
                      <p className="text-gray-900">{selectedProject.customerAddress || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Items ({selectedProject.items.length})</h3>
                  {selectedProject.items.length > 0 ? (
                    <div className="space-y-2">
                      {selectedProject.items.map((item) => (
                        <div key={item.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.length}" x {item.width}" x {item.depth}" | Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">₹{item.amount?.toLocaleString('en-IN')}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No items added</p>
                  )}
                </div>

                {/* Extra Costs */}
                {selectedProject.extraCosts.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Extra Costs</h3>
                    <div className="space-y-2">
                      {selectedProject.extraCosts.map((cost) => (
                        <div key={cost.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-900">{cost.name}</p>
                          <p className={`font-semibold ${cost.amount >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                            {cost.amount >= 0 ? '+' : ''}₹{cost.amount.toLocaleString('en-IN')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="font-bold text-amber-700">
                      ₹{getProjectTotal(selectedProject).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
                  <p>Created by: {users.find(u => u.id === selectedProject.userId)?.name || 'Unknown'}</p>
                  <p>Created: {new Date(selectedProject.createdAt).toLocaleString('en-IN')}</p>
                  <p>Last updated: {new Date(selectedProject.updatedAt).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminQuotationsPage;
