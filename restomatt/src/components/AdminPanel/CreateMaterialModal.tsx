import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign } from 'lucide-react';
import { ProjectType, Material } from '../../types';

interface CreateMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMaterial: (data: {
    name: string;
    ratePerSqft: number;
  }) => void;
  projectType: ProjectType | null;
  editingMaterial?: Material | null;
  onUpdateMaterial?: (materialId: string, updates: Partial<Material>) => void;
}

const CreateMaterialModal: React.FC<CreateMaterialModalProps> = ({
  isOpen,
  onClose,
  onCreateMaterial,
  projectType,
  editingMaterial,
  onUpdateMaterial,
}) => {
  const [name, setName] = useState('');
  const [ratePerSqft, setRatePerSqft] = useState('');

  useEffect(() => {
    if (editingMaterial) {
      setName(editingMaterial.name);
      setRatePerSqft(editingMaterial.ratePerSqft?.toString() ?? '');
    } else {
      setName('');
      setRatePerSqft('');
    }
  }, [editingMaterial, isOpen]);

  const handleClose = () => {
    setName('');
    setRatePerSqft('');
    onClose();
  };

  const handleSubmit = () => {
    const rateSqft = parseFloat(ratePerSqft);
    
    if (name.trim() && !isNaN(rateSqft) && rateSqft > 0) {
      if (editingMaterial && onUpdateMaterial) {
        onUpdateMaterial(editingMaterial.id, {
          name: name.trim(),
          ratePerSqft: rateSqft,
        });
      } else {
        onCreateMaterial({
          name: name.trim(),
          ratePerSqft: rateSqft,
        });
      }
      handleClose();
    }
  };

  const canSubmit = name.trim().length > 0 && 
                   !isNaN(parseFloat(ratePerSqft)) && parseFloat(ratePerSqft) > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingMaterial ? 'Edit Material' : 'Add Material'}
            </h2>
            <p className="text-sm text-gray-500">
              {editingMaterial ? 'Update material details' : `Add a new material${projectType ? ` for ${projectType.name}` : ''}`}
            </p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Material Name */}
          <div>
            <label htmlFor="material-name" className="block text-sm font-medium text-gray-700 mb-2">
              Material Name
            </label>
            <input
              id="material-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Oak Wood, Leather, Fabric"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Rate per Sq Ft */}
          <div>
            <label htmlFor="rate-sqft" className="block text-sm font-medium text-gray-700 mb-2">
              Rate per Sq Ft (Rs)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">₹</span>
              <input
                id="rate-sqft"
                type="number"
                step="0.01"
                min="0"
                value={ratePerSqft}
                onChange={(e) => setRatePerSqft(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Preview */}
          {name && ratePerSqft && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{name}</span>
                <div className="text-sm text-gray-600">
                  ₹{parseFloat(ratePerSqft).toFixed(2)}/sq ft
                </div>
              </div>
            </div>
          )}
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
            <span>{editingMaterial ? 'Update' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMaterialModal;
