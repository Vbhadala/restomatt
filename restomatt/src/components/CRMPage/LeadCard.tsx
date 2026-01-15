import React from 'react';
import { Phone, MessageCircle, User, MapPin, Calendar, MessageSquare } from 'lucide-react';
import { Lead, LeadStatus } from '../../types';

interface LeadCardProps {
  lead: Lead;
  onViewDetails: (lead: Lead) => void;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onViewDetails, onStatusChange }) => {
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

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'No follow-ups yet';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{lead.businessName}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{lead.contactPerson}</span>
          </div>
        </div>
        <select
          value={lead.status}
          onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)} cursor-pointer`}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="New Lead">New Lead</option>
          <option value="Interested">Interested</option>
          <option value="Unanswered">Unanswered</option>
          <option value="Busy">Busy</option>
          <option value="Not Interested">Not Interested</option>
          <option value="Converted">Converted</option>
        </select>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          <span>{lead.mobileNumber}</span>
        </div>
        <div className="flex items-start space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{lead.address}</span>
        </div>
      </div>

      {/* Follow-up Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(lead.lastFollowUpDate)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{lead.followUpNotes.length} notes</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleCallClick}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
        >
          <Phone className="h-4 w-4" />
          <span className="text-sm font-medium">Call</span>
        </button>
        <button
          onClick={handleWhatsAppClick}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm font-medium">WhatsApp</span>
        </button>
        <button
          onClick={() => onViewDetails(lead)}
          className="flex-1 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default LeadCard;
