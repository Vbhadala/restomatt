import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Package, DollarSign } from 'lucide-react';
import { useProjectTypes } from '../../hooks/useProjectTypes';
import { ProjectType, Material } from '../../types';
import CreateProjectTypeModal from './CreateProjectTypeModal';
import CreateMaterialModal from './CreateMaterialModal';
import * as Icons from 'lucide-react';

const AdminPanel: React.FC = () => {
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
      setIsCreateTypeModalOpen(false);
    } catch (error) {
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
      setEditingProjectType(null);
      setIsCreateTypeModalOpen(false);
    } catch (error) {
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
        // For standalone material creation, use the first project type or create a default one
        if (projectTypes.length > 0) {
          await addMaterial(projectTypes[0].id, data);
        } else {
          // Create a default "General" project type first
          const defaultType = await addProjectType({
            name: 'General',
            icon: 'Package',
            description: 'General materials category'
          });
          await addMaterial(defaultType.id, data);
        }
      }
      setIsCreateMaterialModalOpen(false);
      setSelectedProjectType(null);
    } catch (error) {
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
        setEditingMaterial(null);
        setIsCreateMaterialModalOpen(false);
        setSelectedProjectType(null);
      } catch (error) {
        console.error('Error updating material:', error);
      }
    }
  };

  const handleDeleteProjectType = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project type? This will also delete all associated materials.')) {
      try {
        await deleteProjectType(id);
      } catch (error) {
        console.error('Error deleting project type:', error);
      }
    }
  };

  const handleDeleteMaterial = async (projectTypeId: string, materialId: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await deleteMaterial(projectTypeId, materialId);
      } catch (error) {
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage project types and materials</p>
      </div>

      {/* Quick Materials Management */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">All Materials</h2>
          <button
            onClick={() => {
              setIsCreateMaterialModalOpen(true);
              setSelectedProjectType(null);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Standalone Material</span>
          </button>
        </div>

        {/* All materials across all project types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
              <div className="text-xs text-gray-500">
                {projectTypes.find(type => type.materials.some(m => m.id === material.id))?.name || 'Standalone Material'}
              </div>
            </div>
          ))}
        </div>

        {projectTypes.flatMap(type => type.materials).length === 0 && (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Materials Yet</h3>
            <p className="text-gray-600 mb-6">Create your first material to get started</p>
            <button
              onClick={() => {
                setIsCreateMaterialModalOpen(true);
                setSelectedProjectType(null);
              }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create Material</span>
            </button>
          </div>
        )}
      </div>

      {/* Project Types Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Project Types & Materials Organization</h2>
          <button
            onClick={() => setIsCreateTypeModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Project Type</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectTypes.map((type) => (
            <div key={type.id} className="bg-white rounded-lg border border-gray-200 p-6">
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
                  <span className="text-sm font-medium text-gray-700">Materials ({type.materials.length})</span>
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
                    <div key={material.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
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

        {projectTypes.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No project types yet</h3>
            <p className="text-gray-600 mb-6">Create your first project type to get started</p>
            <button
              onClick={() => setIsCreateTypeModalOpen(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create Project Type</span>
            </button>
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
  );
};

export default AdminPanel;
