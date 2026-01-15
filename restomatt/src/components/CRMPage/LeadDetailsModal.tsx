import React, { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, MapPin, User, Building, Calendar, Trash2, Edit2, FileText, CheckCircle, Save } from 'lucide-react';
import { Lead, LeadStatus, FollowUpNote } from '../../types';

interface LeadDetailsModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
  onUpdateLead: (leadId: string, updates: Partial<Lead>) => void;
  onAddNote: (leadId: string, noteText: string) => void;
  onDeleteNote: (leadId: string, noteId: string) => void;
  onDeleteLead: (leadId: string) => void;
  onConvertToQuotation: (leadId: string) => void;
  currentUserName: string;
}

const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({
  lead,
  isOpen,
  onClose,
  onStatusChange,
  onUpdateLead,
  onAddNote,
  onDeleteNote,
  onDeleteLead,
  onConvertToQuotation,
  currentUserName,
}) => {
  const [noteText, setNoteText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    businessName: '',
    contactPerson: '',
    mobileNumber: '',
    address: '',
  });

  // Update form when lead changes
  useEffect(() => {
    if (lead) {
      setEditForm({
        businessName: lead.businessName,
        contactPerson: lead.contactPerson,
        mobileNumber: lead.mobileNumber,
        address: lead.address,
      });
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'New Lead':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Interested':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Unanswered':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Busy':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Not Interested':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Converted':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleCallClick = () => {
    window.location.href = `tel:${lead.mobileNumber}`;
  };

  const handleWhatsAppClick = () => {
    const message = `Hi ${lead.contactPerson}, this is regarding ${lead.businessName}. `;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/91${lead.mobileNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote(lead.id, noteText.trim());
      setNoteText('');
    }
  };

  const handleDeleteLead = () => {
    onDeleteLead(lead.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleSaveEdit = () => {
    onUpdateLead(lead.id, editForm);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      businessName: lead.businessName,
      contactPerson: lead.contactPerson,
      mobileNumber: lead.mobileNumber,
      address: lead.address,
    });
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleConvert = () => {
    if (window.confirm('This will create a new quotation with the lead\'s details. Continue?')) {
      onConvertToQuotation(lead.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{lead.businessName}</h2>
            <p className="text-sm text-gray-600 mt-1">Lead Details</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Status</h3>
            <select
              value={lead.status}
              onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(lead.status)} cursor-pointer`}
            >
              <option value="New Lead">New Lead</option>
              <option value="Interested">Interested</option>
              <option value="Unanswered">Unanswered</option>
              <option value="Busy">Busy</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Converted">Converted</option>
            </select>
          </div>

          {/* Lead Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="text-sm">Edit</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center space-x-1 px-3 py-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span className="text-sm">Save</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Business Name */}
            <div className="flex items-start space-x-3">
              <Building className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Business Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.businessName}
                    onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                ) : (
                  <p className="font-medium text-gray-900">{lead.businessName}</p>
                )}
              </div>
            </div>

            {/* Contact Person */}
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Contact Person</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.contactPerson}
                    onChange={(e) => setEditForm({ ...editForm, contactPerson: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                ) : (
                  <p className="font-medium text-gray-900">{lead.contactPerson}</p>
                )}
              </div>
            </div>

            {/* Mobile Number */}
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Mobile Number</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.mobileNumber}
                    onChange={(e) => setEditForm({ ...editForm, mobileNumber: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                ) : (
                  <p className="font-medium text-gray-900">{lead.mobileNumber}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Address</p>
                {isEditing ? (
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    rows={3}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                ) : (
                  <p className="font-medium text-gray-900">{lead.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCallClick}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>Call</span>
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </button>
            {lead.status !== 'Converted' && (
              <button
                onClick={handleConvert}
                className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Convert to Quotation</span>
              </button>
            )}
            {lead.status === 'Converted' && lead.convertedToProjectId && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                <span>Converted to Quotation</span>
              </div>
            )}
          </div>

          {/* Follow-up Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Follow-up Notes</h3>

            {/* Add Note Form */}
            <div className="mb-4">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a follow-up note..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Note
              </button>
            </div>

            {/* Notes Timeline */}
            <div className="space-y-3">
              {lead.followUpNotes.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No follow-up notes yet</p>
                  <p className="text-sm text-gray-500">Add your first note to track this lead</p>
                </div>
              ) : (
                [...lead.followUpNotes]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((note) => (
                    <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{note.createdByName}</p>
                          <p className="text-xs text-gray-500">{formatDate(note.createdAt)}</p>
                        </div>
                        <button
                          onClick={() => onDeleteNote(lead.id, note.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{note.note}</p>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Delete Lead */}
          <div className="pt-4 border-t border-gray-200">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Lead</span>
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-900 font-medium mb-3">Are you sure you want to delete this lead?</p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDeleteLead}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModal;
