import React from 'react';
import { ProjectType } from '../../types';
import * as Icons from 'lucide-react';

interface ProjectTypeSelectorProps {
  selectedTypeId: string | null;
  onSelectType: (typeId: string) => void;
  projectTypes: ProjectType[];
}

const ProjectTypeSelector: React.FC<ProjectTypeSelectorProps> = ({ 
  selectedTypeId, 
  onSelectType, 
  projectTypes 
}) => {
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-8 w-8" /> : <Icons.Package className="h-8 w-8" />;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Project Type</h3>
        <p className="text-gray-600 text-sm">Choose the type of furniture you want to design</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelectType(type.id)}
            className={`p-6 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
              selectedTypeId === type.id
                ? 'border-amber-500 bg-amber-50 shadow-md'
                : 'border-gray-200 hover:border-amber-300 bg-white'
            }`}
          >
            <div className={`mb-3 ${
              selectedTypeId === type.id ? 'text-amber-600' : 'text-gray-400'
            }`}>
              {getIcon(type.icon)}
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{type.name}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{type.description}</p>
            <div className="mt-3 text-xs text-gray-500">
              {type.materials.length} material types available
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectTypeSelector;