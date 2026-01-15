import React from 'react';
import { Clock, MapPin, Calendar as CalendarIcon, XCircle, Plane } from 'lucide-react';
import { AttendanceRecord } from '../../types';

interface AttendanceHistoryCardProps {
  record: AttendanceRecord;
}

const AttendanceHistoryCard: React.FC<AttendanceHistoryCardProps> = ({ record }) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'checked-out':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          label: 'Completed',
          icon: null,
        };
      case 'checked-in':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          label: 'In Progress',
          icon: null,
        };
      case 'absent':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          label: 'Absent',
          icon: <XCircle className="h-3 w-3" />,
        };
      case 'leave':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-700',
          label: 'On Leave',
          icon: <Plane className="h-3 w-3" />,
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          label: status,
          icon: null,
        };
    }
  };

  const statusBadge = getStatusBadge(record.status);
  const isAbsent = record.status === 'absent';
  const isLeave = record.status === 'leave';

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      {/* Mobile Layout */}
      <div className="md:hidden p-4 space-y-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-gray-600" />
            <span className="font-semibold text-gray-900">{formatDate(record.date)}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusBadge.bg} ${statusBadge.text}`}>
            {statusBadge.icon}
            <span>{statusBadge.label}</span>
          </span>
        </div>

        {/* Absent or Leave - Show reason/notes */}
        {(isAbsent || isLeave) ? (
          <div>
            {isLeave && record.leaveReason && (
              <div className="bg-purple-50 border border-purple-200 rounded p-3">
                <p className="text-xs text-purple-600 mb-1">Leave Reason</p>
                <p className="text-sm text-purple-900">{record.leaveReason}</p>
              </div>
            )}
            {isAbsent && record.notes && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-xs text-red-600 mb-1">Notes</p>
                <p className="text-sm text-red-900">{record.notes}</p>
              </div>
            )}
            {!record.leaveReason && !record.notes && (
              <div className="text-center py-2 text-gray-500 text-sm">
                {isLeave ? 'Planned leave' : 'Marked absent'}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Check-in</p>
                <p className="font-medium text-gray-900 text-sm">
                  {record.checkInTime ? formatTime(record.checkInTime) : '-'}
                </p>
              </div>
              {record.checkOutTime && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Check-out</p>
                  <p className="font-medium text-gray-900 text-sm">{formatTime(record.checkOutTime)}</p>
                </div>
              )}
            </div>

            {record.totalHours && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Total Hours</p>
                <p className="text-lg font-bold text-amber-600">{record.totalHours}h</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Desktop Table-like Layout */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center p-4">
        {/* Date - 2 cols */}
        <div className="col-span-2">
          <div className="font-semibold text-gray-900 text-sm">{formatDate(record.date)}</div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <CalendarIcon className="h-3 w-3 mr-1" />
            <span>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
          </div>
        </div>

        {/* Check-in Time - 2 cols */}
        <div className="col-span-2">
          {isAbsent || isLeave ? (
            <span className="text-gray-400 text-sm">-</span>
          ) : record.checkInTime ? (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="font-medium text-gray-900 text-sm">{formatTime(record.checkInTime)}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">-</span>
          )}
        </div>

        {/* Check-out Time - 2 cols */}
        <div className="col-span-2">
          {isAbsent || isLeave ? (
            <span className="text-gray-400 text-sm">-</span>
          ) : record.checkOutTime ? (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-red-600" />
              <span className="font-medium text-gray-900 text-sm">{formatTime(record.checkOutTime)}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">-</span>
          )}
        </div>

        {/* Total Hours - 1 col */}
        <div className="col-span-1 text-center">
          {isAbsent || isLeave ? (
            <span className="text-gray-400 text-sm">-</span>
          ) : record.totalHours ? (
            <span className="font-bold text-amber-600 text-lg">{record.totalHours}h</span>
          ) : (
            <span className="text-gray-400 text-sm">-</span>
          )}
        </div>

        {/* Status - 2 cols */}
        <div className="col-span-2 text-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center space-x-1 ${statusBadge.bg} ${statusBadge.text}`}>
            {statusBadge.icon}
            <span>{statusBadge.label}</span>
          </span>
        </div>

        {/* Locations or Leave Reason - 3 cols */}
        <div className="col-span-3 text-right">
          {isLeave && record.leaveReason ? (
            <div className="text-xs text-purple-700 font-medium truncate" title={record.leaveReason}>
              {record.leaveReason}
            </div>
          ) : isAbsent ? (
            <span className="text-xs text-red-600">No attendance</span>
          ) : (
            <div className="flex flex-col items-end space-y-1">
              {record.checkInLocation ? (
                <button
                  onClick={() => {
                    const lat = record.checkInLocation!.latitude;
                    const lng = record.checkInLocation!.longitude;
                    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                  }}
                  className="text-xs text-green-600 hover:text-green-800 flex items-center space-x-1"
                  title="View check-in location on map"
                >
                  <MapPin className="h-3 w-3" />
                  <span>Check-in Location</span>
                </button>
              ) : (
                <span className="text-gray-400 text-xs">No check-in location</span>
              )}

              {record.checkOutLocation ? (
                <button
                  onClick={() => {
                    const lat = record.checkOutLocation!.latitude;
                    const lng = record.checkOutLocation!.longitude;
                    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                  }}
                  className="text-xs text-red-600 hover:text-red-800 flex items-center space-x-1"
                  title="View check-out location on map"
                >
                  <MapPin className="h-3 w-3" />
                  <span>Check-out Location</span>
                </button>
              ) : record.checkInLocation && record.status === 'checked-out' ? (
                <span className="text-gray-400 text-xs">No check-out location</span>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistoryCard;
