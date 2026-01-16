import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Package, DollarSign } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useProjectTypes } from '../../hooks/useProjectTypes';
import { ProjectType, Material } from '../../types';
import CreateProjectTypeModal from '../AdminPanel/CreateProjectTypeModal';
import CreateMaterialModal from '../AdminPanel/CreateMaterialModal';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettingsPage: React.FC = () => {
  const {
    projectTypes,
    loading,
    addProjectType,
    updateProjectType,
    deleteProjectType,
    addMaterial,
    updateMaterial,
    deleteMaterial
  } = useProjectTypes();

  const [isCreateTypeModalOpen, setIsCreateTypeModalOpen] = useState(false);
  const [isCreateMaterialModalOpen, setIsCreateMaterialModalOpen] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType | null>(null);
  const [editingProjectType, setEditingProjectType] = useState<ProjectType | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-6 w-6" /> : <Icons.Package className="h-6 w-6" />;
  };

  const handleCreateProjectType = async (data: {
    name: string;
    icon: string;
    description: string;
  }) => {
    try {
      await addProjectType(data);
      toast.success('Project type created');
      setIsCreateTypeModalOpen(false);
    } catch (error) {
      toast.error('Failed to create project type');
      console.error('Error creating project type:', error);
    }
  };

  const handleEditProjectType = (projectType: ProjectType) => {
    setEditingProjectType(projectType);
    setIsCreateTypeModalOpen(true);
  };

  const handleUpdateProjectType = async (id: string, updates: Partial<ProjectType>) => {
    try {
      await updateProjectType(id, updates);
      toast.success('Project type updated');
      setEditingProjectType(null);
      setIsCreateTypeModalOpen(false);
    } catch (error) {
      toast.error('Failed to update project type');
      console.error('Error updating project type:', error);
    }
  };

  const handleCreateMaterial = async (data: {
    name: string;
    ratePerSqft: number;
  }) => {
    try {
      if (selectedProjectType) {
        await addMaterial(selectedProjectType.id, data);
      } else {
        if (projectTypes.length > 0) {
          await addMaterial(projectTypes[0].id, data);
        } else {
          const defaultType = await addProjectType({
            name: 'General',
            icon: 'Package',
            description: 'General materials category'
          });
          await addMaterial(defaultType.id, data);
        }
      }
      toast.success('Material created');
      setIsCreateMaterialModalOpen(false);
      setSelectedProjectType(null);
    } catch (error) {
      toast.error('Failed to create material');
      console.error('Error creating material:', error);
    }
  };

  const handleEditMaterial = (projectType: ProjectType, material: Material) => {
    setSelectedProjectType(projectType);
    setEditingMaterial(material);
    setIsCreateMaterialModalOpen(true);
  };

  const handleUpdateMaterial = async (materialId: string, updates: Partial<Material>) => {
    if (selectedProjectType) {
      try {
        await updateMaterial(selectedProjectType.id, materialId, updates);
        toast.success('Material updated');
        setEditingMaterial(null);
        setIsCreateMaterialModalOpen(false);
        setSelectedProjectType(null);
      } catch (error) {
        toast.error('Failed to update material');
        console.error('Error updating material:', error);
      }
    }
  };

  const handleDeleteProjectType = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project type? This will also delete all associated materials.')) {
      try {
        await deleteProjectType(id);
        toast.success('Project type deleted');
      } catch (error) {
        toast.error('Failed to delete project type');
        console.error('Error deleting project type:', error);
      }
    }
  };

  const handleDeleteMaterial = async (projectTypeId: string, materialId: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await deleteMaterial(projectTypeId, materialId);
        toast.success('Material deleted');
      } catch (error) {
        toast.error('Failed to delete material');
        console.error('Error deleting material:', error);
      }
    }
  };

  const handleCloseModals = () => {
    setIsCreateTypeModalOpen(false);
    setIsCreateMaterialModalOpen(false);
    setEditingProjectType(null);
    setEditingMaterial(null);
    setSelectedProjectType(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage project types and materials</p>
        </div>

        {/* All Materials Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">All Materials</h2>
            <button
              onClick={() => {
                setIsCreateMaterialModalOpen(true);
                setSelectedProjectType(null);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Material</span>
            </button>
          </div>

          {projectTypes.flatMap(type => type.materials).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTypes.flatMap(type => type.materials).map((material) => (
                <div key={material.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{material.name}</span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          const parentType = projectTypes.find(type => type.materials.some(m => m.id === material.id));
                          if (parentType) {
                            setSelectedProjectType(parentType);
                            setEditingMaterial(material);
                            setIsCreateMaterialModalOpen(true);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-amber-600 transition-colors"
                        title="Edit material"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => {
                          const parentType = projectTypes.find(type => type.materials.some(m => m.id === material.id));
                          if (parentType) {
                            handleDeleteMaterial(parentType.id, material.id);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete material"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Rate:</strong> ₹{material.ratePerSqft}/sq ft
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {projectTypes.find(type => type.materials.some(m => m.id === material.id))?.name || 'Unknown'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Materials Yet</h3>
              <p className="text-gray-600">Create your first material to get started</p>
            </div>
          )}
        </div>

        {/* Project Types Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Project Types</h2>
            <button
              onClick={() => setIsCreateTypeModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Project Type</span>
            </button>
          </div>

          {projectTypes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectTypes.map((type) => (
                <div key={type.id} className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-amber-600">
                        {getIcon(type.icon)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{type.name}</h3>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditProjectType(type)}
                        className="p-1 text-gray-400 hover:text-amber-600 transition-colors"
                        title="Edit project type"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProjectType(type.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete project type"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Materials ({type.materials.length})
                      </span>
                      <button
                        onClick={() => {
                          setSelectedProjectType(type);
                          setIsCreateMaterialModalOpen(true);
                        }}
                        className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Add Material
                      </button>
                    </div>

                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {type.materials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-2 bg-white rounded">
                          <div>
                            <span className="text-sm font-medium text-gray-900">{material.name}</span>
                            <div className="text-xs text-gray-500">
                              ₹{material.ratePerSqft}/sq ft
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditMaterial(type, material)}
                              className="p-1 text-gray-400 hover:text-amber-600 transition-colors"
                              title="Edit material"
                            >
                              <Edit3 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteMaterial(type.id, material.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete material"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {type.materials.length === 0 && (
                      <p className="text-xs text-gray-500 text-center py-2">No materials added yet</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Types Yet</h3>
              <p className="text-gray-600">Create your first project type to get started</p>
            </div>
          )}
        </div>

        {/* Modals */}
        <CreateProjectTypeModal
          isOpen={isCreateTypeModalOpen}
          onClose={handleCloseModals}
          onCreateProjectType={handleCreateProjectType}
          editingProjectType={editingProjectType}
          onUpdateProjectType={handleUpdateProjectType}
        />

        <CreateMaterialModal
          isOpen={isCreateMaterialModalOpen}
          onClose={handleCloseModals}
          onCreateMaterial={handleCreateMaterial}
          projectType={selectedProjectType}
          editingMaterial={editingMaterial}
          onUpdateMaterial={handleUpdateMaterial}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
