import React, { useState, useMemo, useEffect } from 'react';
import { Users, Plus, Search, TrendingUp, UserCheck, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AppLayout from '../AppLayout/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { useLeads } from '../../hooks/useLeads';
import { Lead, LeadStatus } from '../../types';
import AddLeadModal from './AddLeadModal';
import LeadCard from './LeadCard';
import LeadDetailsModal from './LeadDetailsModal';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';

const CRMPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');

  const { leads, loading, addLead, updateLead, updateLeadStatus, addFollowUpNote, deleteFollowUpNote, deleteLead, markLeadAsConverted } = useLeads(currentUser?.id || '');
  const { addProject } = useProjects(currentUser?.id || '');

  // Debug: Log leads changes
  useEffect(() => {
    console.log('CRMPage: Leads updated, count:', leads.length, 'leads:', leads);
  }, [leads]);

  // Filter and search leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Status filter
      if (statusFilter !== 'All' && lead.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          lead.businessName.toLowerCase().includes(query) ||
          lead.contactPerson.toLowerCase().includes(query) ||
          lead.mobileNumber.includes(query) ||
          lead.address.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [leads, searchQuery, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: leads.length,
      newLeads: leads.filter(l => l.status === 'New Lead').length,
      converted: leads.filter(l => l.status === 'Converted').length,
    };
  }, [leads]);

  if (!currentUser) return null;

  const handleAddLead = async (leadData: {
    businessName: string;
    contactPerson: string;
    mobileNumber: string;
    address: string;
  }) => {
    const toastId = toast.loading('Adding lead...');
    try {
      console.log('CRMPage: Adding lead with data:', leadData);
      const newLead = await addLead(leadData);
      console.log('CRMPage: Lead added successfully:', newLead);
      console.log('CRMPage: Current leads count:', leads.length);
      toast.success('Lead added successfully!', { id: toastId });
    } catch (error: any) {
      console.error('Error adding lead:', error);
      toast.error(error.message || 'Failed to add lead', { id: toastId });
    }
  };

  const handleUpdateLead = async (leadId: string, updates: Partial<Lead>) => {
    const toastId = toast.loading('Updating lead...');
    try {
      await updateLead(leadId, updates);
      toast.success('Lead updated successfully!', { id: toastId });
    } catch (error: any) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead', { id: toastId });
    }
  };

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    const toastId = toast.loading('Updating status...');
    try {
      await updateLeadStatus(leadId, status);
      toast.success('Status updated successfully!', { id: toastId });
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status', { id: toastId });
    }
  };

  const handleAddNote = async (leadId: string, noteText: string) => {
    const toastId = toast.loading('Adding note...');
    try {
      await addFollowUpNote(leadId, noteText, currentUser.name);
      toast.success('Note added successfully!', { id: toastId });
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note', { id: toastId });
    }
  };

  const handleDeleteNote = async (leadId: string, noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const toastId = toast.loading('Deleting note...');
      try {
        await deleteFollowUpNote(leadId, noteId);
        toast.success('Note deleted successfully!', { id: toastId });
      } catch (error: any) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note', { id: toastId });
      }
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    const toastId = toast.loading('Deleting lead...');
    try {
      await deleteLead(leadId);
      toast.success('Lead deleted successfully!', { id: toastId });
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead', { id: toastId });
    }
  };

  const handleConvertToQuotation = async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const toastId = toast.loading('Converting to quotation...');
    try {
      // Create a new project with lead details
      const newProject = await addProject({
        name: `${lead.businessName} Project`,
        typeId: '', // User will select later
        customerName: lead.contactPerson,
        customerMobile: lead.mobileNumber,
        customerAddress: lead.address,
      });

      // Mark lead as converted with project reference
      await markLeadAsConverted(leadId, newProject.id);

      toast.success('Lead converted to quotation successfully!', { id: toastId });

      // Navigate to the app page
      navigate('/app');
    } catch (error: any) {
      console.error('Error converting lead:', error);
      toast.error('Failed to convert lead', { id: toastId });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Relationship Management</h1>
          <p className="text-gray-600">Manage your customer leads and relationships</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">New Leads</p>
                <p className="text-3xl font-bold text-gray-900">{stats.newLeads}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Converted</p>
                <p className="text-3xl font-bold text-gray-900">{stats.converted}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'All')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="New Lead">New Lead</option>
              <option value="Interested">Interested</option>
              <option value="Unanswered">Unanswered</option>
              <option value="Busy">Busy</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Converted">Converted</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddLeadModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Lead</span>
          </button>
        </div>

        {/* Leads Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            <p className="mt-4 text-gray-600">Loading leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'All' ? 'No leads found' : 'No leads yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'All'
                ? 'Try adjusting your search or filter'
                : 'Start by adding your first lead'}
            </p>
            {!searchQuery && statusFilter === 'All' && (
              <button
                onClick={() => setIsAddLeadModalOpen(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add Your First Lead</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onViewDetails={setSelectedLead}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onSubmit={handleAddLead}
      />

      <LeadDetailsModal
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={handleStatusChange}
        onUpdateLead={handleUpdateLead}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
        onDeleteLead={handleDeleteLead}
        onConvertToQuotation={handleConvertToQuotation}
        currentUserName={currentUser.name}
      />
    </AppLayout>
  );
};

export default CRMPage;
