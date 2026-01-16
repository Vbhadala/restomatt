import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User, Project, Lead, Task, AttendanceRecord, DayActivity } from '../types';

// Hook to fetch all users
export const useAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || 'Unknown',
        email: doc.data().email || '',
        avatar: doc.data().avatar || '',
        isAdmin: doc.data().isAdmin || false,
      })) as User[];

      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error('useAllUsers: Error listening to users:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUser = async (userId: string, updates: Partial<User>) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
  };

  const toggleAdminStatus = async (userId: string, isAdmin: boolean) => {
    await updateUser(userId, { isAdmin });
  };

  return {
    users,
    loading,
    updateUser,
    toggleAdminStatus,
  };
};

// Hook to fetch all projects across all users
export const useAllProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        items: doc.data().items || [],
        itemGroups: doc.data().itemGroups || [],
        extraCosts: doc.data().extraCosts || [],
        milestones: doc.data().milestones || [],
        photos: doc.data().photos || [],
      })) as Project[];

      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error('useAllProjects: Error listening to projects:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteProject = async (projectId: string) => {
    await deleteDoc(doc(db, 'projects', projectId));
  };

  return {
    projects,
    loading,
    deleteProject,
  };
};

// Hook to fetch all leads across all users
export const useAllLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'leads'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const leadsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastFollowUpDate: doc.data().lastFollowUpDate?.toDate(),
        followUpNotes: (doc.data().followUpNotes || []).map((note: any) => ({
          ...note,
          createdAt: note.createdAt?.toDate() || new Date(),
        })),
      })) as Lead[];

      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
      console.error('useAllLeads: Error listening to leads:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteLead = async (leadId: string) => {
    await deleteDoc(doc(db, 'leads', leadId));
  };

  return {
    leads,
    loading,
    deleteLead,
  };
};

// Hook to fetch all tasks
export const useAllTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'tasks'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        dueDate: doc.data().dueDate?.toDate() || new Date(),
        notes: (doc.data().notes || []).map((note: any) => ({
          ...note,
          createdAt: note.createdAt?.toDate() || new Date(),
        })),
      })) as Task[];

      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      console.error('useAllTasks: Error listening to tasks:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, 'tasks', taskId));
  };

  return {
    tasks,
    loading,
    deleteTask,
  };
};

// Hook to fetch all attendance records
export const useAllAttendance = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'attendance'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const attendanceData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        date: doc.data().date?.toDate() || new Date(),
        checkInTime: doc.data().checkInTime?.toDate(),
        checkOutTime: doc.data().checkOutTime?.toDate(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as AttendanceRecord[];

      setAttendance(attendanceData);
      setLoading(false);
    }, (error) => {
      console.error('useAllAttendance: Error listening to attendance:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    attendance,
    loading,
  };
};

// Hook to fetch all day activities
export const useAllDayActivities = () => {
  const [activities, setActivities] = useState<DayActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'dayActivities'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const activitiesData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as DayActivity[];

      setActivities(activitiesData);
      setLoading(false);
    }, (error) => {
      console.error('useAllDayActivities: Error listening to activities:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    activities,
    loading,
  };
};
