import { useState, useEffect } from 'react';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ProjectType, Material } from '../types';
import { defaultProjectTypes } from '../data/projectTypes';
import { db } from '../firebase';

export const useProjectTypes = () => {
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, immediately set to empty and loading false
    // to prevent Firestore permission errors on landing page
    if (window.location.pathname === '/' || window.location.hash === '' || window.location.hash === '#landing') {
      setProjectTypes(defaultProjectTypes.map(type => ({
        ...type,
        id: type.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })));
      setLoading(false);
      return;
    }

    // Real-time listener for project types
    const projectTypesQuery = query(
      collection(db, 'projectTypes'),
      orderBy('createdAt', 'desc')
    );

    // Real-time listener for materials
    const materialsQuery = query(
      collection(db, 'materials'),
      orderBy('createdAt', 'desc')
    );

    const userToListener = () => {
      let typesUnsubscribe: () => void;
      let materialsUnsubscribe: () => void;

      // Listen to project types
      typesUnsubscribe = onSnapshot(projectTypesQuery,
        (projectTypesSnapshot) => {
          materialsUnsubscribe = onSnapshot(materialsQuery, (materialsSnapshot) => {
            const materials = materialsSnapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id,
              createdAt: doc.data().createdAt?.toDate() || new Date(),
              updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as Material[];

            const typesData = projectTypesSnapshot.docs.map(doc => {
              const typeData = doc.data();
              const typeMaterials = materials.filter(m => m.projectTypeId === doc.id);

              return {
                ...typeData,
                id: doc.id,
                createdAt: typeData.createdAt?.toDate() || new Date(),
                updatedAt: typeData.updatedAt?.toDate() || new Date(),
                materials: typeMaterials,
              };
            }) as ProjectType[];

            // If no data exists, initialize with default data
            if (typesData.length === 0 && materials.length === 0) {
              initializeDefaultData();
            } else {
              setProjectTypes(typesData);
            }
            setLoading(false);
          }, (error) => {
            // Handle permission errors gracefully
            console.warn('Permission denied for materials:', error);
            // Fall back to default data for demo
            setProjectTypes(defaultProjectTypes.map(type => ({
              ...type,
              id: type.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            })));
            setLoading(false);
          });

          return materialsUnsubscribe;
        },
        (error) => {
          // Handle permission errors gracefully
          console.warn('Permission denied for project types:', error);
          // Fall back to default data for demo
          setProjectTypes(defaultProjectTypes.map(type => ({
            ...type,
            id: type.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          })));
          setLoading(false);
        }
      );

      return typesUnsubscribe!;
    };

    try {
      const unsubscribe = userToListener();
      return () => unsubscribe?.();
    } catch (error) {
      // If anything goes wrong, fall back to default data
      console.warn('Error setting up Firebase listeners:', error);
      setProjectTypes(defaultProjectTypes.map(type => ({
        ...type,
        id: type.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })));
      setLoading(false);
    }
  }, []);

  const initializeDefaultData = async () => {
    try {
      for (const projectType of defaultProjectTypes) {
        const projectTypeDoc = await addDoc(collection(db, 'projectTypes'), {
          name: projectType.name,
          icon: projectType.icon,
          description: projectType.description,
          materials: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Add materials for this project type
        for (const material of projectType.materials) {
          await addDoc(collection(db, 'materials'), {
            ...material,
            projectTypeId: projectTypeDoc.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error('Error initializing default data:', error);
    }
  };

  const addProjectType = async (projectType: Omit<ProjectType, 'id' | 'createdAt' | 'updatedAt' | 'materials'>) => {
    try {
      const docRef = await addDoc(collection(db, 'projectTypes'), {
        ...projectType,
        materials: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const newType: ProjectType = {
        ...projectType,
        id: docRef.id,
        materials: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return newType;
    } catch (error) {
      console.error('Error adding project type:', error);
      throw error;
    }
  };

  const updateProjectType = async (id: string, updates: Partial<ProjectType>) => {
    try {
      // Filter out undefined values
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      const projectTypeRef = doc(db, 'projectTypes', id);
      await updateDoc(projectTypeRef, {
        ...cleanUpdates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating project type:', error);
      throw error;
    }
  };

  const deleteProjectType = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projectTypes', id));
    } catch (error) {
      console.error('Error deleting project type:', error);
      throw error;
    }
  };

  const addMaterial = async (projectTypeId: string, material: Omit<Material, 'id' | 'createdAt' | 'updatedAt' | 'projectTypeId'>) => {
    try {
      const materialDoc = await addDoc(collection(db, 'materials'), {
        ...material,
        projectTypeId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const newMaterial: Material = {
        ...material,
        id: materialDoc.id,
        projectTypeId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return newMaterial;
    } catch (error) {
      console.error('Error adding material:', error);
      throw error;
    }
  };

  const updateMaterial = async (projectTypeId: string, materialId: string, updates: Partial<Material>) => {
    try {
      // Filter out undefined values
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      const materialRef = doc(db, 'materials', materialId);
      await updateDoc(materialRef, {
        ...cleanUpdates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating material:', error);
      throw error;
    }
  };

  const deleteMaterial = async (projectTypeId: string, materialId: string) => {
    try {
      await deleteDoc(doc(db, 'materials', materialId));
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  };

  return {
    projectTypes,
    loading,
    addProjectType,
    updateProjectType,
    deleteProjectType,
    addMaterial,
    updateMaterial,
    deleteMaterial,
  };
};
