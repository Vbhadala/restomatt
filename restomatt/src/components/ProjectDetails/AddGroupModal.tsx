import React, { useState, useEffect } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { ItemGroup } from '../../types';

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGroup: (groupData: { name: string }) => void;
  editingGroup?: ItemGroup | null;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({
  isOpen,
  onClose,
  onAddGroup,
  editingGroup
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (editingGroup) {
      setName(editingGroup.name);
    } else {
      setName('');
    }
  }, [editingGroup, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a group name');
      return;
    }

    onAddGroup({
      name: name.trim()
    });

    setName('');
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <FolderPlus className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {editingGroup ? 'Edit Group' : 'Add New Group'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Group Name */}
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                Group Name *
              </label>
              <input
                type="text"
                id="groupName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., Kitchen Cabinets, Living Room, etc."
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Create groups to organize your project items better
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
            >
              <FolderPlus className="h-4 w-4" />
              <span>{editingGroup ? 'Update Group' : 'Add Group'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGroupModal;
