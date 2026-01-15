import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Task, TaskNote, TaskStatus } from '../types';

export const useTask = (userId: string, isAdmin: boolean) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!userId || userId.trim() === '') {
      console.log('useTask: No user ID provided, not loading tasks');
      setLoading(false);
      return;
    }

    console.log('useTask: Setting up listener for user:', userId, 'isAdmin:', isAdmin);

    // Build query based on user role
    // Admin sees all tasks, regular users see only their assigned tasks
    const q = isAdmin
      ? query(collection(db, 'tasks'), orderBy('dueDate', 'asc'))
      : query(
          collection(db, 'tasks'),
          where('assignedToId', '==', userId),
          orderBy('dueDate', 'asc')
        );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log(`useTask: Received ${querySnapshot.docs.length} tasks`);
      const tasksList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          dueDate: data.dueDate?.toDate() || new Date(),
          notes: (data.notes || []).map((note: any) => ({
            ...note,
            createdAt: note.createdAt?.toDate() || new Date(),
          })),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Task;
      });

      setTasks(tasksList);
      setLoading(false);
    }, (error) => {
      console.error('useTask: Error loading tasks:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, isAdmin]);

  const createTask = async (
    title: string,
    details: string,
    dueDate: Date,
    assignedToId: string,
    assignedToName: string,
    assignedByName: string
  ): Promise<Task> => {
    if (!userId || userId.trim() === '') {
      throw new Error('User not authenticated. Please log in again.');
    }

    if (!title.trim()) {
      throw new Error('Task title is required.');
    }

    if (!details.trim()) {
      throw new Error('Task details are required.');
    }

    if (!assignedToId || !assignedToName) {
      throw new Error('Task must be assigned to a user.');
    }

    setSubmitting(true);

    try {
      const now = new Date();
      const newTask = {
        title: title.trim(),
        details: details.trim(),
        dueDate: Timestamp.fromDate(dueDate),
        status: 'open' as TaskStatus,
        assignedToId,
        assignedToName,
        assignedById: userId,
        assignedByName,
        notes: [],
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      };

      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      console.log('useTask: Task created with ID:', docRef.id);

      return {
        ...newTask,
        id: docRef.id,
        dueDate,
        createdAt: now,
        updatedAt: now,
      } as Task;
    } catch (error: any) {
      console.error('useTask: Error creating task:', error);
      throw new Error(`Failed to create task: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus): Promise<void> => {
    if (!taskId) {
      throw new Error('Task ID is required.');
    }

    setSubmitting(true);

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      console.log('useTask: Task status updated:', taskId, status);
    } catch (error: any) {
      console.error('useTask: Error updating task status:', error);
      throw new Error(`Failed to update task status: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const addTaskNote = async (
    taskId: string,
    noteText: string,
    userName: string
  ): Promise<void> => {
    if (!taskId) {
      throw new Error('Task ID is required.');
    }

    if (!noteText.trim()) {
      throw new Error('Note text is required.');
    }

    setSubmitting(true);

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Task not found.');
      }

      const now = new Date();
      const newNote: TaskNote = {
        id: `note_${now.getTime()}`,
        note: noteText.trim(),
        createdAt: now,
        createdBy: userId,
        createdByName: userName,
      };

      const updatedNotes = [...task.notes, newNote];

      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        notes: updatedNotes.map(note => ({
          ...note,
          createdAt: Timestamp.fromDate(note.createdAt),
        })),
        updatedAt: Timestamp.fromDate(now),
      });

      console.log('useTask: Note added to task:', taskId);
    } catch (error: any) {
      console.error('useTask: Error adding note:', error);
      throw new Error(`Failed to add note: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const updateTask = async (
    taskId: string,
    title: string,
    details: string,
    dueDate: Date,
    assignedToId: string,
    assignedToName: string
  ): Promise<void> => {
    if (!taskId) {
      throw new Error('Task ID is required.');
    }

    if (!title.trim()) {
      throw new Error('Task title is required.');
    }

    if (!details.trim()) {
      throw new Error('Task details are required.');
    }

    setSubmitting(true);

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        title: title.trim(),
        details: details.trim(),
        dueDate: Timestamp.fromDate(dueDate),
        assignedToId,
        assignedToName,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      console.log('useTask: Task updated:', taskId);
    } catch (error: any) {
      console.error('useTask: Error updating task:', error);
      throw new Error(`Failed to update task: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    tasks,
    loading,
    submitting,
    createTask,
    updateTaskStatus,
    addTaskNote,
    updateTask,
  };
};
