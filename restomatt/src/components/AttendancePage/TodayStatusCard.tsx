import React from 'react';
import { Clock, MapPin, LogIn, LogOut, Loader2, XCircle } from 'lucide-react';
import { AttendanceRecord } from '../../types';

interface TodayStatusCardProps {
  todayRecord: AttendanceRecord | null;
  checkingIn: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onMarkAbsent: () => void;
}

const TodayStatusCard: React.FC<TodayStatusCardProps> = ({
  todayRecord,
  checkingIn,
  onCheckIn,
  onCheckOut,
  onMarkAbsent,
}) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const isCheckedIn = todayRecord?.status === 'checked-in';
  const isCheckedOut = todayRecord?.status === 'checked-out';
  const isAbsent = todayRecord?.status === 'absent';
  const isLeave = todayRecord?.status === 'leave';

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 md:p-5 shadow-lg">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Today's Attendance</h2>
        <p className="text-sm text-gray-600">{formatDate(new Date())}</p>
      </div>

      {/* Status Display */}
      {!todayRecord ? (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Not Checked In</span>
          </div>
          <p className="text-gray-600 text-xs">
            Start your workday by checking in. We'll record your time and location.
          </p>
        </div>
      ) : isCheckedIn ? (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Currently Checked In</span>
          </div>

          <div className="bg-white rounded-lg p-3 space-y-2">
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-gray-600 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Check-in Time</p>
                <p className="font-semibold text-gray-900 text-sm">{formatTime(todayRecord.checkInTime)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-600 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-medium text-gray-900 text-xs">
                  {todayRecord.checkInLocation.latitude.toFixed(6)}, {todayRecord.checkInLocation.longitude.toFixed(6)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Accuracy: ±{Math.round(todayRecord.checkInLocation.accuracy)}m
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : isCheckedOut ? (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-700">Checked Out</span>
          </div>

          <div className="bg-white rounded-lg p-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start space-x-1">
                <LogIn className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Check-in</p>
                  <p className="font-semibold text-gray-900 text-xs">{formatTime(todayRecord.checkInTime!)}</p>
                  {todayRecord.checkInLocation && (
                    <button
                      onClick={() => {
                        const lat = todayRecord.checkInLocation!.latitude;
                        const lng = todayRecord.checkInLocation!.longitude;
                        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                      }}
                      className="mt-1 text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <MapPin className="h-3 w-3" />
                      <span>Map</span>
                    </button>
                  )}
                </div>
              </div>

              {todayRecord.checkOutTime && (
                <div className="flex items-start space-x-1">
                  <LogOut className="h-4 w-4 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Check-out</p>
                    <p className="font-semibold text-gray-900 text-xs">{formatTime(todayRecord.checkOutTime)}</p>
                    {todayRecord.checkOutLocation && (
                      <button
                        onClick={() => {
                          const lat = todayRecord.checkOutLocation!.latitude;
                          const lng = todayRecord.checkOutLocation!.longitude;
                          window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                        }}
                        className="mt-1 text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <MapPin className="h-3 w-3" />
                        <span>Map</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {todayRecord.totalHours && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Total Hours Worked</p>
                <p className="text-xl font-bold text-amber-600">{todayRecord.totalHours}h</p>
              </div>
            )}
          </div>
        </div>
      ) : isAbsent ? (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium text-red-700">Marked Absent</span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-red-800 font-medium text-sm">You were marked absent for today</p>
            {todayRecord.notes && (
              <p className="text-xs text-red-600 mt-1">{todayRecord.notes}</p>
            )}
          </div>
        </div>
      ) : isLeave ? (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium text-purple-700">On Leave</span>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
            <p className="text-purple-800 font-medium text-sm">You are on leave today</p>
            {todayRecord.leaveReason && (
              <p className="text-xs text-purple-600 mt-1">Reason: {todayRecord.leaveReason}</p>
            )}
          </div>
        </div>
      ) : null}

      {/* Action Buttons */}
      {!todayRecord && (
        <div className="space-y-2">
          <button
            onClick={onCheckIn}
            disabled={checkingIn}
            className={`w-full py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center space-x-2 ${
              checkingIn
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {checkingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>Check In</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to mark yourself as absent for today?')) {
                onMarkAbsent();
              }
            }}
            disabled={checkingIn}
            className="w-full py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center space-x-2 bg-white border-2 border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle className="h-4 w-4" />
            <span>Mark Absent</span>
          </button>
        </div>
      )}

      {isCheckedIn && (
        <button
          onClick={onCheckOut}
          disabled={checkingIn}
          className={`w-full py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center space-x-2 ${
            checkingIn
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {checkingIn ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <LogOut className="h-5 w-5" />
              <span>Check Out</span>
            </>
          )}
        </button>
      )}

      {isCheckedOut && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-blue-800 font-medium text-sm">
            You've completed your workday. See you tomorrow! 👋
          </p>
        </div>
      )}

      {/* Location Permission Note */}
      {!todayRecord && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          📍 Location permission required for attendance tracking
        </p>
      )}
    </div>
  );
};

export default TodayStatusCard;
