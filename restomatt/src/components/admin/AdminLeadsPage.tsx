import React, { useState, useMemo } from 'react';
import {
  Search,
  User,
  Calendar,
  Eye,
  Trash2,
  ChevronDown,
  Phone,
  MapPin,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAllUsers, useAllLeads } from '../../hooks/useAdminData';
import toast from 'react-hot-toast';
import { Lead, LeadStatus } from '../../types';

const statusColors: Record<LeadStatus, string> = {
  'New Lead': 'bg-blue-100 text-blue-700',
  'Interested': 'bg-green-100 text-green-700',
  'Unanswered': 'bg-yellow-100 text-yellow-700',
  'Busy': 'bg-orange-100 text-orange-700',
  'Not Interested': 'bg-red-100 text-red-700',
  'Converted': 'bg-purple-100 text-purple-700',
};

const AdminLeadsPage: React.FC = () => {
  const { users, loading: usersLoading } = useAllUsers();
  const { leads, loading: leadsLoading, deleteLead } = useAllLeads();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const loading = usersLoading || leadsLoading;

  const allStatuses: LeadStatus[] = [
    'New Lead',
    'Interested',
    'Unanswered',
    'Busy',
    'Not Interested',
    'Converted',
  ];

  // Filter and search leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch =
        lead.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.mobileNumber.includes(searchQuery) ||
        lead.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesUser = filterUser === 'all' || lead.userId === filterUser;
      const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;

      return matchesSearch && matchesUser && matchesStatus;
    });
  }, [leads, searchQuery, filterUser, filterStatus]);

  const handleDeleteLead = async (leadId: string) => {
    try {
      await deleteLead(leadId);
      toast.success('Lead deleted successfully');
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete lead');
    }
  };

  // Stats by status
  const statusStats = allStatuses.map(status => ({
    status,
    count: leads.filter(l => l.status === status).length,
  }));

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
            <h1 className="text-2xl font-bold text-gray-900">All Leads</h1>
            <p className="text-gray-600">View and manage leads from all users</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {statusStats.slice(0, 4).map(({ status, count }) => (
              <span key={status} className={`${statusColors[status]} px-3 py-1 rounded-full`}>
                {status}: {count}
              </span>
            ))}
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
                placeholder="Search by business, contact, mobile, or address..."
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
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => {
            const user = users.find(u => u.id === lead.userId);

            return (
              <div key={lead.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{lead.businessName}</h3>
                    <p className="text-sm text-gray-600">{lead.contactPerson}</p>
                  </div>
                  <span className={`${statusColors[lead.status]} px-2 py-1 rounded-full text-xs font-medium`}>
                    {lead.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{lead.mobileNumber}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{lead.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>{user?.name || 'Unknown'}</span>
                  </div>
                </div>

                {/* Follow-up Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <MessageSquare className="h-4 w-4" />
                    <span>{lead.followUpNotes.length} notes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(lead.id)}
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

        {filteredLeads.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <UserCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Lead?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. All follow-up notes associated with this lead will be permanently deleted.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteLead(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-bold text-gray-900">{selectedLead.businessName}</h2>
                      <span className={`${statusColors[selectedLead.status]} px-2 py-1 rounded-full text-xs font-medium`}>
                        {selectedLead.status}
                      </span>
                    </div>
                    <p className="text-gray-600">{selectedLead.contactPerson}</p>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-2xl leading-none"
                  >
                    &times;
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Mobile</p>
                      <p className="text-gray-900">{selectedLead.mobileNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Follow-up</p>
                      <p className="text-gray-900">
                        {selectedLead.lastFollowUpDate
                          ? new Date(selectedLead.lastFollowUpDate).toLocaleDateString('en-IN')
                          : 'Never'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-500">Address</p>
                      <p className="text-gray-900">{selectedLead.address}</p>
                    </div>
                  </div>
                </div>

                {/* Follow-up Notes */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Follow-up Notes ({selectedLead.followUpNotes.length})
                  </h3>
                  {selectedLead.followUpNotes.length > 0 ? (
                    <div className="space-y-3">
                      {selectedLead.followUpNotes.map((note) => (
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
                    <p className="text-gray-500">No follow-up notes added</p>
                  )}
                </div>

                {/* Meta Info */}
                <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
                  <p>Created by: {users.find(u => u.id === selectedLead.userId)?.name || 'Unknown'}</p>
                  <p>Created: {new Date(selectedLead.createdAt).toLocaleString('en-IN')}</p>
                  <p>Last updated: {new Date(selectedLead.updatedAt).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLeadsPage;
