import React, { useState, useEffect } from 'react';
import { X, Check, Package } from 'lucide-react';
import { ProjectType } from '../../types';
import * as Icons from 'lucide-react';

interface CreateProjectTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProjectType: (data: {
    name: string;
    icon: string;
    description: string;
  }) => void;
  editingProjectType?: ProjectType | null;
  onUpdateProjectType?: (id: string, updates: Partial<ProjectType>) => void;
}

const iconOptions = [
  'ChefHat', 'Armchair', 'Bed', 'UtensilsCrossed', 'Briefcase', 'Bath',
  'Sofa', 'Lamp', 'Home', 'Building', 'Package', 'Wrench'
];

const CreateProjectTypeModal: React.FC<CreateProjectTypeModalProps> = ({
  isOpen,
  onClose,
  onCreateProjectType,
  editingProjectType,
  onUpdateProjectType,
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Package');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingProjectType) {
      setName(editingProjectType.name);
      setIcon(editingProjectType.icon);
      setDescription(editingProjectType.description);
    } else {
      setName('');
      setIcon('Package');
      setDescription('');
    }
  }, [editingProjectType, isOpen]);

  const handleClose = () => {
    setName('');
    setIcon('Package');
    setDescription('');
    onClose();
  };

  const handleSubmit = () => {
    if (name.trim() && description.trim()) {
      if (editingProjectType && onUpdateProjectType) {
        onUpdateProjectType(editingProjectType.id, {
          name: name.trim(),
          icon,
          description: description.trim(),
        });
      } else {
        onCreateProjectType({
          name: name.trim(),
          icon,
          description: description.trim(),
        });
      }
      handleClose();
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-6 w-6" /> : <Icons.Package className="h-6 w-6" />;
  };

  const canSubmit = name.trim().length > 0 && description.trim().length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingProjectType ? 'Edit Project Type' : 'Create Project Type'}
            </h2>
            <p className="text-sm text-gray-500">
              {editingProjectType ? 'Update the project type details' : 'Add a new project type for users to select'}
            </p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="type-name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              id="type-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Kitchen, Bedroom, Office"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-3">
              {iconOptions.map((iconName) => (
                <button
                  key={iconName}
                  onClick={() => setIcon(iconName)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    icon === iconName
                      ? 'border-amber-500 bg-amber-50 text-amber-600'
                      : 'border-gray-200 hover:border-amber-300 text-gray-400'
                  }`}
                >
                  {getIcon(iconName)}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="type-description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="type-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this project type is for..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
            <div className="flex items-center space-x-3">
              <div className="text-amber-600">
                {getIcon(icon)}
              </div>
              <div>
                <h5 className="font-semibold text-gray-900">{name || 'Project Type Name'}</h5>
                <p className="text-sm text-gray-600">{description || 'Project type description'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              canSubmit
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check className="h-4 w-4" />
            <span>{editingProjectType ? 'Update' : 'Create'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectTypeModal;