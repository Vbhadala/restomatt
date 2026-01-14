import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProjects } from '../../hooks/useProjects';
import { useProjectTypes } from '../../hooks/useProjectTypes';
import { Project, User } from '../../types';
import Header from '../Header/Header';
import ProjectCard from '../ProjectCard/ProjectCard';
import CreateProjectModal from '../CreateProjectModal/CreateProjectModal';
import ProjectDetails from '../ProjectDetails/ProjectDetails';

interface AppPageProps {
  currentUser: User;
}

const AppPage: React.FC<AppPageProps> = ({ currentUser }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const {
    projects,
    loading: projectsLoading,
    addProject,
    deleteProject,
    updateProject,
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
    addItemGroup,
    updateItemGroup,
    deleteItemGroup
  } = useProjects(currentUser.id);

  const { projectTypes, loading: typesLoading } = useProjectTypes();

  const filteredProjects = projects.filter(project => {
    const projectType = projectTypes.find(pt => pt.id === project.typeId);
    return project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           projectType?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreateProject = async (projectData: {
    name: string;
    customerName?: string;
    customerMobile?: string;
    customerAddress?: string;
    typeId: string;
  }) => {
    const toastId = toast.loading('Creating project...');
    try {
      const newProject = await addProject(projectData);
      toast.success('Project created successfully!', { id: toastId });
      setSelectedProject(newProject);
      setIsCreateModalOpen(false);
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error(error.message || 'Failed to create project. Please try again.', { id: toastId });
    }
  };

  const handleEditProject = (project: Project) => {
    const latestProject = projects.find(p => p.id === project.id) || project;
    setSelectedProject(latestProject);
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const toastId = toast.loading('Deleting project...');
      try {
        await deleteProject(id);
        toast.success('Project deleted successfully!', { id: toastId });
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project. Please try again.', { id: toastId });
      }
    }
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    setSelectedProject(updatedProject);
  };

  React.useEffect(() => {
    if (selectedProject) {
      const updatedProject = projects.find(p => p.id === selectedProject.id);
      if (updatedProject) {
        setSelectedProject(updatedProject);
      }
    }
  }, [projects, selectedProject]);

  if (projectsLoading || typesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <ProjectDetails
          project={selectedProject}
          projectTypes={projectTypes}
          onBack={handleBackToProjects}
          onUpdateProject={handleProjectUpdate}
          addProjectItem={addProjectItem}
          updateProjectItem={updateProjectItem}
          deleteProjectItem={deleteProjectItem}
          addExtraCost={addExtraCost}
          updateExtraCost={updateExtraCost}
          deleteExtraCost={deleteExtraCost}
          addMilestone={addMilestone}
          updateMilestone={updateMilestone}
          deleteMilestone={deleteMilestone}
          addProjectPhoto={addProjectPhoto}
          updateProjectPhoto={updateProjectPhoto}
          deleteProjectPhoto={deleteProjectPhoto}
          addItemGroup={addItemGroup}
          updateItemGroup={updateItemGroup}
          deleteItemGroup={deleteItemGroup}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Projects</h1>
          <p className="text-gray-600">Create and manage your furniture design projects</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {projects.length === 0 ? 'No projects yet' : 'No projects found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {projects.length === 0
                ? 'Get started by creating your first furniture design project'
                : 'Try adjusting your search terms'
              }
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Create Your First Project</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                projectTypes={projectTypes}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
        projectTypes={projectTypes}
      />
    </div>
  );
};

export default AppPage;
