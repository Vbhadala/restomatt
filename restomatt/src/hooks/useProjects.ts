import { useState, useEffect } from 'react';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Project, ProjectItem, ExtraCost, Milestone, ProjectPhoto } from '../types';

export const useProjects = (userId: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || userId.trim() === '') {
      console.log('useProjects: No user ID provided, not loading projects');
      setLoading(false);
      return;
    }

    console.log('useProjects: Setting up listener for user:', userId);

    // Real-time listener for projects
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log(`useProjects: Received ${querySnapshot.docs.length} projects for user ${userId}`);
      const projectsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        items: doc.data().items || [],
        extraCosts: doc.data().extraCosts || [],
        milestones: doc.data().milestones || [],
        photos: doc.data().photos || [],
      })) as Project[];

      console.log('useProjects: Setting projects data:', projectsData.length, 'projects');
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error('useProjects: Error listening to projects:', error);
      setLoading(false);
    });

    return () => {
      console.log('useProjects: Cleaning up listener');
      unsubscribe();
    };
  }, [userId]);

  // Helper function to update project document in Firestore
  const updateProjectDoc = async (projectId: string, updates: any) => {
    // Remove undefined values to prevent Firebase errors
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      ...cleanUpdates,
      updatedAt: new Date(),
    });
  };

  const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'items' | 'extraCosts' | 'milestones' | 'photos'>) => {
    // Validate user authentication
    if (!userId || userId.trim() === '') {
      throw new Error('User not authenticated. Please log in again.');
    }

    const newProject = {
      ...project,
      userId,
      items: [],
      extraCosts: [],
      milestones: [],
      photos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('About to create project with:', {
      projectData: newProject,
      userIdInHook: userId
    });

    try {
      console.log('Creating project for user:', userId); // Debug log
      const docRef = await addDoc(collection(db, 'projects'), newProject);
      console.log('Project created successfully:', docRef.id); // Debug log
      return { ...newProject, id: docRef.id } as Project;
    } catch (error: any) {
      console.error('Project creation error details:', {
        code: error.code,
        message: error.message,
        userId,
        projectData: newProject
      });

      // Provide more specific error messages
      if (error.code === 'permission-denied') {
        throw new Error(`Permission denied. Your user ID (${userId}) may not match the authenticated user. Try refreshing the page and logging in again.`);
      }
      if (error.code === 'unavailable') {
        throw new Error('Network error - your browser may be blocking Firebase connections. Try disabling ad blockers or VPN temporarily.');
      }

      throw new Error(`Failed to create project: ${error.message}`);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    // Clean updates to remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    const projectRef = doc(db, 'projects', id);
    await updateDoc(projectRef, {
      ...cleanUpdates,
      updatedAt: new Date(),
    });
  };

  const deleteProject = async (id: string) => {
    // Delete associated photos from storage
    const project = projects.find(p => p.id === id);
    if (project?.photos) {
      for (const photo of project.photos) {
        try {
          const photoRef = ref(storage, `projects/${id}/${photo.fileName}`);
          await deleteObject(photoRef);
        } catch (error) {
          console.error('Error deleting photo:', error);
        }
      }
    }

    await deleteDoc(doc(db, 'projects', id));
  };

  const addProjectItem = async (projectId: string, item: Omit<ProjectItem, 'id' | 'sqft' | 'amount'>, materialRate: number) => {
    const sqft = (item.length * item.width) / 92903;
    const amount = sqft * materialRate * item.quantity;

    const newItem: ProjectItem = {
      ...item,
      id: Date.now().toString(),
      sqft: Math.round(sqft * 100) / 100,
      amount: Math.round(amount * 100) / 100,
    };

    const project = projects.find(p => p.id === projectId);
    if (project) {
      const updatedItems = [...project.items, newItem];
      await updateProjectDoc(projectId, { items: updatedItems });
      return newItem;
    }
    throw new Error('Project not found');
  };

  const updateProjectItem = async (projectId: string, itemId: string, updates: Partial<ProjectItem>, materialRate: number) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedItems = project.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, ...updates };
        const sqft = (updatedItem.length * updatedItem.width) / 92903;
        const amount = sqft * materialRate * updatedItem.quantity;
        return {
          ...updatedItem,
          sqft: Math.round(sqft * 100) / 100,
          amount: Math.round(amount * 100) / 100,
        };
      }
      return item;
    });

    await updateProjectDoc(projectId, { items: updatedItems });
  };

  const deleteProjectItem = async (projectId: string, itemId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedItems = project.items.filter(item => item.id !== itemId);
    await updateProjectDoc(projectId, { items: updatedItems });
  };

  const addExtraCost = async (projectId: string, extraCost: Omit<ExtraCost, 'id'>) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const newExtraCost: ExtraCost = {
      ...extraCost,
      id: Date.now().toString(),
    };

    const updatedExtraCosts = [...(project.extraCosts || []), newExtraCost];
    await updateProjectDoc(projectId, { extraCosts: updatedExtraCosts });
    return newExtraCost;
  };

  const updateExtraCost = async (projectId: string, extraCostId: string, updates: Partial<ExtraCost>) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedExtraCosts = (project.extraCosts || []).map(cost =>
      cost.id === extraCostId ? { ...cost, ...updates } : cost
    );

    await updateProjectDoc(projectId, { extraCosts: updatedExtraCosts });
  };

  const deleteExtraCost = async (projectId: string, extraCostId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedExtraCosts = (project.extraCosts || []).filter(cost => cost.id !== extraCostId);
    await updateProjectDoc(projectId, { extraCosts: updatedExtraCosts });
  };

  // Milestone management functions
  const addMilestone = async (projectId: string, milestone: Omit<Milestone, 'id'>) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const newMilestone: Milestone = {
      ...milestone,
      id: Date.now().toString(),
    };

    const updatedMilestones = [...(project.milestones || []), newMilestone];
    await updateProjectDoc(projectId, { milestones: updatedMilestones });
    return newMilestone;
  };

  const updateMilestone = async (projectId: string, milestoneId: string, updates: Partial<Milestone>) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedMilestones = (project.milestones || []).map(milestone =>
      milestone.id === milestoneId ? { ...milestone, ...updates } : milestone
    );

    await updateProjectDoc(projectId, { milestones: updatedMilestones });
  };

  const deleteMilestone = async (projectId: string, milestoneId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedMilestones = (project.milestones || []).filter(milestone => milestone.id !== milestoneId);
    await updateProjectDoc(projectId, { milestones: updatedMilestones });
  };

  // Photo management functions with Firebase Storage
  const addProjectPhoto = async (projectId: string, photo: Omit<ProjectPhoto, 'id' | 'uploadedAt'>) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const newPhoto: ProjectPhoto = {
      ...photo,
      id: Date.now().toString(),
      uploadedAt: new Date(),
    };

    const updatedPhotos = [...(project.photos || []), newPhoto];
    await updateProjectDoc(projectId, { photos: updatedPhotos });
    return newPhoto;
  };

  const updateProjectPhoto = async (projectId: string, photoId: string, updates: Partial<ProjectPhoto>) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedPhotos = (project.photos || []).map(photo =>
      photo.id === photoId ? { ...photo, ...updates } : photo
    );

    await updateProjectDoc(projectId, { photos: updatedPhotos });
  };

  const deleteProjectPhoto = async (projectId: string, photoId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const photoToDelete = project.photos.find(p => p.id === photoId);
    if (photoToDelete?.url) {
      try {
        const photoRef = ref(storage, photoToDelete.url);
        await deleteObject(photoRef);
      } catch (error) {
        console.error('Error deleting photo from storage:', error);
      }
    }

    const updatedPhotos = (project.photos || []).filter(photo => photo.id !== photoId);
    await updateProjectDoc(projectId, { photos: updatedPhotos });
  };

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    addProjectItem,
    updateProjectItem,
    deleteProjectItem,
    addExtraCost,
    updateExtraCost,
    deleteExtraCost,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addProjectPhoto,
    updateProjectPhoto,
    deleteProjectPhoto,
  };
};
