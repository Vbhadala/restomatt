import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { DayActivity } from '../types';

export const useDayBook = (userId: string) => {
  const [activities, setActivities] = useState<DayActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || userId.trim() === '') {
      console.log('useDayBook: No user ID provided, not loading activities');
      setLoading(false);
      return;
    }

    console.log('useDayBook: Setting up listener for user:', userId);

    // Real-time listener for activities
    const q = query(
      collection(db, 'dayActivities'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log(`useDayBook: Received ${querySnapshot.docs.length} activities for user ${userId}`);
      const activitiesData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as DayActivity[];

      console.log('useDayBook: Setting activities data:', activitiesData.length, 'activities');
      setActivities(activitiesData);
      setLoading(false);
    }, (error) => {
      console.error('useDayBook: Error listening to activities:', error);
      setLoading(false);
    });

    return () => {
      console.log('useDayBook: Cleaning up listener');
      unsubscribe();
    };
  }, [userId]);

  const addActivity = async (activity: Omit<DayActivity, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    // Validate user authentication
    if (!userId || userId.trim() === '') {
      throw new Error('User not authenticated. Please log in again.');
    }

    const newActivity = {
      ...activity,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Creating activity for user:', userId);

    try {
      const docRef = await addDoc(collection(db, 'dayActivities'), newActivity);
      console.log('Activity created successfully:', docRef.id);
      return { ...newActivity, id: docRef.id } as DayActivity;
    } catch (error: any) {
      console.error('Activity creation error details:', {
        code: error.code,
        message: error.message,
        userId,
        activityData: newActivity
      });

      if (error.code === 'permission-denied') {
        throw new Error(`Permission denied. Your user ID (${userId}) may not match the authenticated user. Try refreshing the page and logging in again.`);
      }
      if (error.code === 'unavailable') {
        throw new Error('Network error - your browser may be blocking Firebase connections. Try disabling ad blockers or VPN temporarily.');
      }

      throw new Error(`Failed to create activity: ${error.message}`);
    }
  };

  const updateActivity = async (id: string, updates: Partial<Omit<DayActivity, 'id' | 'userId' | 'createdAt'>>) => {
    // Clean updates to remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    const activityRef = doc(db, 'dayActivities', id);
    await updateDoc(activityRef, {
      ...cleanUpdates,
      updatedAt: new Date(),
    });
  };

  const deleteActivity = async (id: string) => {
    await deleteDoc(doc(db, 'dayActivities', id));
  };

  return {
    activities,
    loading,
    addActivity,
    updateActivity,
    deleteActivity,
  };
};
