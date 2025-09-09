import React, { useState } from 'react';
import { Plus, Search, Filter, Home, LogIn } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useProjectTypes } from '../../hooks/useProjectTypes';
import { useAuth } from '../../hooks/useAuth';
import { Project, User } from '../../types';
import Header from '../Header/Header';
import LandingPage from '../LandingPage/LandingPage';
import CollectionPage from '../CollectionPage/CollectionPage';
import ProjectCard from '../ProjectCard/ProjectCard';
import CreateProjectModal from '../CreateProjectModal/CreateProjectModal';
import ProjectDetails from '../ProjectDetails/ProjectDetails';
import AdminPanel from '../AdminPanel/AdminPanel';
import { collections, Collection } from '../../data/collections';

interface DashboardProps {
  currentUser: User | null;
  onShowLogin: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onShowLogin }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [currentView, setCurrentView] = useState<string>('landing');

  // Only load projects and project types data when user is authenticated or on landing page
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
    deleteProjectPhoto
  } = useProjects(currentUser?.id || (currentView !== 'landing' ? '' : ''));
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
    try {
      const newProject = await addProject(projectData);
      setSelectedProject(newProject);
      setCurrentView('project-details');
      // Close modal after successful creation
      setIsCreateModalOpen(false);
    } catch (error: any) {
      console.error('Error creating project:', error);
      // Show user-friendly error message
      alert(error.message || 'Failed to create project. Please try again.');
    }
  };

  const handleStartProject = () => {
    if (!currentUser) {
      onShowLogin();
      return;
    }
    setCurrentView('projects');
  };

  const handleViewCollection = (collection: Collection) => {
    if (!currentUser) {
      onShowLogin();
      return;
    }
    setSelectedCollection(collection);
    setCurrentView('collection');
  };

  const handleEditProject = (project: Project) => {
    if (!currentUser) {
      onShowLogin();
      return;
    }
    // Get the latest version of the project from the projects array
    const latestProject = projects.find(p => p.id === project.id) || project;
    setSelectedProject(latestProject);
    setCurrentView('project-details');
  };

  const handleDeleteProject = async (id: string) => {
    if (!currentUser) {
      onShowLogin();
      return;
    }
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleCreateNewProject = () => {
    if (!currentUser) {
      onShowLogin();
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setCurrentView('projects');
  };

  const handleBackToLanding = () => {
    setSelectedProject(null);
    setCurrentView('landing');
  };

  const handleBackToLandingFromCollection = () => {
    setSelectedCollection(null);
    setCurrentView('landing');
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    // Update the selected project state when items are modified
    setSelectedProject(updatedProject);
  };

  // Check URL hash for admin panel
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (window.location.hash === '#projects') {
        setCurrentView('projects');
      } else if (window.location.hash === '' || window.location.hash === '#landing') {
        setCurrentView('landing');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update selected project when projects array changes
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

  // Allow landing page without authentication
  if (currentView === 'landing') {
    return <LandingPage onStartProject={handleStartProject} onViewCollection={handleViewCollection} />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to access this application.</p>
        </div>
      </div>
    );
  }

  if (currentView === 'collection' && selectedCollection) {
    return (
      <CollectionPage
        collection={selectedCollection}
        onBack={handleBackToLandingFromCollection}
        onStartProject={handleStartProject}
      />
    );
  }



  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBackToLanding={handleBackToLanding} />
        <AdminPanel />
      </div>
    );
  }



  if (currentView === 'project-details' && selectedProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBackToLanding={handleBackToLanding} />
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
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBackToLanding={handleBackToLanding} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Landing Button */}
        <div className="mb-6">
          <button
            onClick={handleBackToLanding}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
        </div>

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
              onClick={handleCreateNewProject}
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
            {projects.length === 0 && currentUser && (
              <button
                onClick={handleCreateNewProject}
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

export default Dashboard;
