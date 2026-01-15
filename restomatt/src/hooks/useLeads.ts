import { useState, useEffect } from 'react';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Lead, FollowUpNote, LeadStatus } from '../types';

export const useLeads = (userId: string) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || userId.trim() === '') {
      console.log('useLeads: No user ID provided, not loading leads');
      setLoading(false);
      return;
    }

    console.log('useLeads: Setting up listener for user:', userId);

    // Real-time listener for leads
    const q = query(
      collection(db, 'leads'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log(`useLeads: Received ${querySnapshot.docs.length} leads for user ${userId}`);
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

      console.log('useLeads: Setting leads data:', leadsData.length, 'leads');
      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
      console.error('useLeads: Error listening to leads:', error);
      setLoading(false);
    });

    return () => {
      console.log('useLeads: Cleaning up listener');
      unsubscribe();
    };
  }, [userId]);

  // Helper function to update lead document in Firestore
  const updateLeadDoc = async (leadId: string, updates: any) => {
    // Remove undefined values to prevent Firebase errors
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    const leadRef = doc(db, 'leads', leadId);
    await updateDoc(leadRef, {
      ...cleanUpdates,
      updatedAt: new Date(),
    });
  };

  const addLead = async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'followUpNotes' | 'status'>) => {
    // Validate user authentication
    if (!userId || userId.trim() === '') {
      throw new Error('User not authenticated. Please log in again.');
    }

    const newLead = {
      ...lead,
      userId,
      status: 'New Lead' as LeadStatus,
      followUpNotes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('About to create lead with:', {
      leadData: newLead,
      userIdInHook: userId
    });

    try {
      console.log('Creating lead for user:', userId);
      const docRef = await addDoc(collection(db, 'leads'), newLead);
      console.log('Lead created successfully:', docRef.id);
      return { ...newLead, id: docRef.id } as Lead;
    } catch (error: any) {
      console.error('Lead creation error details:', {
        code: error.code,
        message: error.message,
        userId,
        leadData: newLead
      });

      // Provide more specific error messages
      if (error.code === 'permission-denied') {
        throw new Error(`Permission denied. Your user ID (${userId}) may not match the authenticated user. Try refreshing the page and logging in again.`);
      }
      if (error.code === 'unavailable') {
        throw new Error('Network error - your browser may be blocking Firebase connections. Try disabling ad blockers or VPN temporarily.');
      }

      throw new Error(`Failed to create lead: ${error.message}`);
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    // Clean updates to remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    const leadRef = doc(db, 'leads', id);
    await updateDoc(leadRef, {
      ...cleanUpdates,
      updatedAt: new Date(),
    });
  };

  const deleteLead = async (id: string) => {
    await deleteDoc(doc(db, 'leads', id));
  };

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    await updateLeadDoc(leadId, { status });
  };

  const addFollowUpNote = async (leadId: string, noteText: string, userName: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    const newNote: FollowUpNote = {
      id: Date.now().toString(),
      note: noteText,
      createdAt: new Date(),
      createdBy: userId,
      createdByName: userName,
    };

    const updatedNotes = [...lead.followUpNotes, newNote];
    await updateLeadDoc(leadId, {
      followUpNotes: updatedNotes,
      lastFollowUpDate: new Date(),
    });
    return newNote;
  };

  const updateFollowUpNote = async (leadId: string, noteId: string, noteText: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const updatedNotes = lead.followUpNotes.map(note =>
      note.id === noteId ? { ...note, note: noteText } : note
    );

    await updateLeadDoc(leadId, { followUpNotes: updatedNotes });
  };

  const deleteFollowUpNote = async (leadId: string, noteId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const updatedNotes = lead.followUpNotes.filter(note => note.id !== noteId);
    await updateLeadDoc(leadId, { followUpNotes: updatedNotes });
  };

  const markLeadAsConverted = async (leadId: string, projectId: string) => {
    await updateLeadDoc(leadId, {
      status: 'Converted',
      convertedToProjectId: projectId,
    });
  };

  return {
    leads,
    loading,
    addLead,
    updateLead,
    deleteLead,
    updateLeadStatus,
    addFollowUpNote,
    updateFollowUpNote,
    deleteFollowUpNote,
    markLeadAsConverted,
  };
};
