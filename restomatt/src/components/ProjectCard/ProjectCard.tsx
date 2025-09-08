import React from 'react';
import { Project, ProjectType } from '../../types';
import { Calendar, Edit3, Trash2, DollarSign, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  projectTypes: ProjectType[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, projectTypes, onEdit, onDelete }) => {
  const projectType = projectTypes.find(type => type.id === project.typeId);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getTotalAmount = () => {
    const itemsTotal = project.items.reduce((total, item) => total + item.amount, 0);
    const extraCostsTotal = (project.extraCosts || []).reduce((total, cost) => total + cost.amount, 0);
    return itemsTotal + extraCostsTotal;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
            <p className="text-sm text-amber-700 font-medium mb-2">{projectType?.name || 'Unknown Type'}</p>
            
            <div className="space-y-1 mb-3">
              <p className="text-sm text-gray-600">
                {project.items.length} item{project.items.length !== 1 ? 's' : ''}
              </p>
              {(project.items.length > 0 || (project.extraCosts && project.extraCosts.length > 0)) && (
                <div className="flex items-center text-sm text-green-600">
                  <span className="mr-1">₹</span>
                  <span className="font-medium">{getTotalAmount().toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              Updated {formatDate(project.updatedAt)}
            </div>
          </div>
          
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onEdit(project)}
              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
              title="Open project details"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Delete project"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-3 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {project.items.length === 0 ? 'No items yet' : `${project.items.length} items configured`}
          </span>
          <button
            onClick={() => onEdit(project)}
            className="flex items-center space-x-1 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            <span>{project.items.length === 0 ? 'Add Items' : 'View Details'}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;