import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { AttendanceRecord, GeoLocation } from '../types';

// Helper function to get current location
const getCurrentLocation = (): Promise<GeoLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(),
        });
      },
      (error) => {
        reject(new Error(`Location error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

// Helper function to normalize date to start of day
const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

// Helper function to calculate hours between two dates
const calculateHours = (start: Date, end: Date): number => {
  const diff = end.getTime() - start.getTime();
  return Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
};

export const useAttendance = (userId: string, userName: string) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    if (!userId || userId.trim() === '') {
      console.log('useAttendance: No user ID provided, not loading attendance');
      setLoading(false);
      return;
    }

    console.log('useAttendance: Setting up listener for user:', userId);

    // Real-time listener for attendance records
    const q = query(
      collection(db, 'attendance'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log(`useAttendance: Received ${querySnapshot.docs.length} attendance records for user ${userId}`);
      const records = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        date: doc.data().date?.toDate() || new Date(),
        checkInTime: doc.data().checkInTime?.toDate(),
        checkOutTime: doc.data().checkOutTime?.toDate(),
        checkInLocation: doc.data().checkInLocation ? {
          ...doc.data().checkInLocation,
          timestamp: doc.data().checkInLocation?.timestamp?.toDate() || new Date(),
        } : undefined,
        checkOutLocation: doc.data().checkOutLocation ? {
          ...doc.data().checkOutLocation,
          timestamp: doc.data().checkOutLocation?.timestamp?.toDate() || new Date(),
        } : undefined,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as AttendanceRecord[];

      setAttendanceRecords(records);

      // Find today's record
      const today = normalizeDate(new Date());
      const todaysRecord = records.find(record => {
        const recordDate = normalizeDate(record.date);
        return recordDate.getTime() === today.getTime();
      });
      setTodayRecord(todaysRecord || null);

      setLoading(false);
    }, (error) => {
      console.error('useAttendance: Error listening to attendance:', error);
      setLoading(false);
    });

    return () => {
      console.log('useAttendance: Cleaning up listener');
      unsubscribe();
    };
  }, [userId]);

  const checkIn = async (): Promise<AttendanceRecord> => {
    if (!userId || userId.trim() === '') {
      throw new Error('User not authenticated. Please log in again.');
    }

    if (todayRecord && todayRecord.status === 'checked-in') {
      throw new Error('You are already checked in for today.');
    }

    setCheckingIn(true);

    try {
      // Get current location
      const location = await getCurrentLocation();
      const now = new Date();

      const newRecord = {
        userId,
        userName,
        date: normalizeDate(now),
        checkInTime: now,
        checkInLocation: location,
        status: 'checked-in' as const,
        createdAt: now,
        updatedAt: now,
      };

      console.log('Creating attendance check-in for user:', userId);
      const docRef = await addDoc(collection(db, 'attendance'), newRecord);
      console.log('Check-in created successfully:', docRef.id);

      setCheckingIn(false);
      return { ...newRecord, id: docRef.id } as AttendanceRecord;
    } catch (error: any) {
      setCheckingIn(false);
      console.error('Check-in error details:', {
        code: error.code,
        message: error.message,
        userId,
      });

      if (error.message.includes('Location')) {
        throw new Error('Unable to get your location. Please enable location permissions and try again.');
      }

      if (error.code === 'permission-denied') {
        throw new Error(`Permission denied. Please ensure you're logged in and try again.`);
      }

      throw new Error(`Failed to check in: ${error.message}`);
    }
  };

  const checkOut = async (): Promise<void> => {
    if (!todayRecord) {
      throw new Error('No check-in record found for today.');
    }

    if (todayRecord.status === 'checked-out') {
      throw new Error('You have already checked out for today.');
    }

    setCheckingIn(true);

    try {
      // Get current location
      const location = await getCurrentLocation();
      const now = new Date();
      const totalHours = calculateHours(todayRecord.checkInTime, now);

      const attendanceRef = doc(db, 'attendance', todayRecord.id);
      await updateDoc(attendanceRef, {
        checkOutTime: now,
        checkOutLocation: location,
        totalHours,
        status: 'checked-out',
        updatedAt: now,
      });

      console.log('Check-out successful for record:', todayRecord.id);
      setCheckingIn(false);
    } catch (error: any) {
      setCheckingIn(false);
      console.error('Check-out error details:', {
        code: error.code,
        message: error.message,
        userId,
      });

      if (error.message.includes('Location')) {
        throw new Error('Unable to get your location. Please enable location permissions and try again.');
      }

      throw new Error(`Failed to check out: ${error.message}`);
    }
  };

  // Get records for a specific date range
  const getRecordsByDateRange = async (startDate: Date, endDate: Date): Promise<AttendanceRecord[]> => {
    const q = query(
      collection(db, 'attendance'),
      where('userId', '==', userId),
      where('date', '>=', normalizeDate(startDate)),
      where('date', '<=', normalizeDate(endDate)),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      date: doc.data().date?.toDate() || new Date(),
      checkInTime: doc.data().checkInTime?.toDate() || new Date(),
      checkOutTime: doc.data().checkOutTime?.toDate(),
      checkInLocation: {
        ...doc.data().checkInLocation,
        timestamp: doc.data().checkInLocation?.timestamp?.toDate() || new Date(),
      },
      checkOutLocation: doc.data().checkOutLocation ? {
        ...doc.data().checkOutLocation,
        timestamp: doc.data().checkOutLocation?.timestamp?.toDate() || new Date(),
      } : undefined,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as AttendanceRecord[];
  };

  const markAbsent = async (date?: Date): Promise<void> => {
    if (!userId || userId.trim() === '') {
      throw new Error('User not authenticated. Please log in again.');
    }

    const targetDate = date ? normalizeDate(date) : normalizeDate(new Date());

    // Check if there's already a record for this date
    const existingRecord = attendanceRecords.find(record => {
      const recordDate = normalizeDate(record.date);
      return recordDate.getTime() === targetDate.getTime();
    });

    if (existingRecord) {
      throw new Error('An attendance record already exists for this date.');
    }

    const now = new Date();
    const newRecord = {
      userId,
      userName,
      date: targetDate,
      status: 'absent' as const,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await addDoc(collection(db, 'attendance'), newRecord);
      console.log('Absence marked successfully for date:', targetDate);
    } catch (error: any) {
      console.error('Mark absent error:', error);
      throw new Error(`Failed to mark absent: ${error.message}`);
    }
  };

  const addLeave = async (startDate: Date, endDate: Date, reason: string): Promise<void> => {
    if (!userId || userId.trim() === '') {
      throw new Error('User not authenticated. Please log in again.');
    }

    const start = normalizeDate(startDate);
    const end = normalizeDate(endDate);

    if (start > end) {
      throw new Error('Start date must be before or equal to end date.');
    }

    try {
      const leaves: Promise<any>[] = [];
      const currentDate = new Date(start);

      while (currentDate <= end) {
        const leaveDate = new Date(currentDate);

        // Check if record already exists for this date
        const existingRecord = attendanceRecords.find(record => {
          const recordDate = normalizeDate(record.date);
          return recordDate.getTime() === normalizeDate(leaveDate).getTime();
        });

        if (!existingRecord) {
          const now = new Date();
          const leaveRecord = {
            userId,
            userName,
            date: normalizeDate(leaveDate),
            status: 'leave' as const,
            leaveReason: reason,
            createdAt: now,
            updatedAt: now,
          };
          leaves.push(addDoc(collection(db, 'attendance'), leaveRecord));
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      await Promise.all(leaves);
      console.log('Leave added successfully');
    } catch (error: any) {
      console.error('Add leave error:', error);
      throw new Error(`Failed to add leave: ${error.message}`);
    }
  };

  const getUpcomingLeaves = () => {
    const today = normalizeDate(new Date());
    return attendanceRecords
      .filter(record => {
        const recordDate = normalizeDate(record.date);
        return record.status === 'leave' && recordDate >= today;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  return {
    attendanceRecords,
    todayRecord,
    loading,
    checkingIn,
    checkIn,
    checkOut,
    markAbsent,
    addLeave,
    getUpcomingLeaves,
    getRecordsByDateRange,
  };
};
