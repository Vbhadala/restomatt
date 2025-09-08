import React, { useState, useEffect } from 'react';
import { X, Check, Calculator, DollarSign } from 'lucide-react';
import { Material, ProjectItem } from '../../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: {
    name: string;
    length: number;
    width: number;
    depth: number;
    materialId: string;
    quantity: number;
    note?: string;
    customRate?: number;
  }) => void;
  onUpdateItem?: (itemData: {
    name: string;
    length: number;
    width: number;
    depth: number;
    materialId: string;
    quantity: number;
    note?: string;
    customRate?: number;
  }) => void;
  materials: (Material & { displayName?: string })[];
  editingItem?: ProjectItem | null;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  materials,
  editingItem,
}) => {
  const [name, setName] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [useCustomRate, setUseCustomRate] = useState(false);
  const [customRate, setCustomRate] = useState('');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setLength(editingItem.length?.toString() ?? '');
      setWidth(editingItem.width?.toString() ?? '');
      setDepth(editingItem.depth?.toString() ?? '');
      setMaterialId(editingItem.materialId);
      setQuantity(editingItem.quantity?.toString() ?? '1');
      setNote(editingItem.note || '');
      setUseCustomRate(editingItem.customRate !== undefined);
      setCustomRate(editingItem.customRate?.toString() ?? '');
    } else {
      setName('');
      setLength('');
      setWidth('');
      setDepth('');
      setMaterialId('');
      setQuantity('1');
      setNote('');
      setUseCustomRate(false);
      setCustomRate('');
    }
  }, [editingItem, isOpen]);

  // Update rate when material changes (for new items only)
  useEffect(() => {
    if (materialId && !editingItem && !useCustomRate) {
      // Reset to admin rate when material changes and not editing
      setUseCustomRate(false);
      setCustomRate('');
    }
  }, [materialId, editingItem, useCustomRate]);

  const handleClose = () => {
    setName('');
    setLength('');
    setWidth('');
    setDepth('');
    setMaterialId('');
    setQuantity('1');
    setNote('');
    onClose();
  };

  const handleSubmit = () => {
    const lengthNum = parseFloat(length);
    const widthNum = parseFloat(width);
    const depthNum = parseFloat(depth);
    const quantityNum = parseInt(quantity);
    const customRateNum = parseFloat(customRate);

    if (name.trim() && !isNaN(lengthNum) && !isNaN(widthNum) &&
        materialId && !isNaN(quantityNum) && lengthNum > 0 && widthNum > 0 &&
        quantityNum > 0 && (!useCustomRate || (!isNaN(customRateNum) && customRateNum >= 0))) {
      onAddItem({
        name: name.trim(),
        length: lengthNum,
        width: widthNum,
        depth: depthNum,
        materialId,
        quantity: quantityNum,
        note: note.trim() || undefined,
        customRate: useCustomRate ? customRateNum : undefined,
      });
      handleClose();
    }
  };

  const getPreviewCalculation = () => {
    const lengthNum = parseFloat(length);
    const widthNum = parseFloat(width);
    const quantityNum = parseInt(quantity);
    const material = materials.find(m => m.id === materialId);

    if (!isNaN(lengthNum) && !isNaN(widthNum) && !isNaN(quantityNum) && material) {
      const sqft = (lengthNum * widthNum ) / 92903;

      // Use custom rate if set, otherwise use admin/material rate
      let rateToUse = material.ratePerSqft;
      if (useCustomRate && customRate && !isNaN(parseFloat(customRate))) {
        rateToUse = parseFloat(customRate);
      } else if (editingItem?.customRate) {
        rateToUse = editingItem.customRate;
      }

      const amount = sqft * rateToUse * quantityNum;
      return {
        sqft: Math.round(sqft * 100) / 100,
        amount: Math.round(amount * 100) / 100,
        material: material.name,
        rate: rateToUse
      };
    }
    return null;
  };

  const preview = getPreviewCalculation();

  const canSubmit = name.trim().length > 0 &&
                   !isNaN(parseFloat(length)) && parseFloat(length) > 0 &&
                   !isNaN(parseFloat(width)) && parseFloat(width) > 0 &&
                   materialId.length > 0 &&
                   !isNaN(parseInt(quantity)) && parseInt(quantity) > 0 &&
                   (!useCustomRate || (!isNaN(parseFloat(customRate)) && parseFloat(customRate) >= 0));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <p className="text-sm text-gray-500">
              {editingItem ? 'Update item details' : 'Add a new item to your project'}
            </p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Item Name */}
          <div>
            <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              id="item-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Cabinet Door, Shelf, Drawer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-2">
                Width (mm) *
              </label>
              <input
                id="width"
                type="number"
                step="0.1"
                min="0"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
                Length (mm) *
              </label>
              <input
                id="length"
                type="number"
                step="0.1"
                min="0"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="depth" className="block text-sm font-medium text-gray-700 mb-2">
                Depth (mm)
              </label>
              <input
                id="depth"
                type="number"
                step="0.1"
                min="0"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Material Selection */}
          <div>
            <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-2">
              Material *
            </label>
            <select
              id="material"
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Select material</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity and Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="customRate" className="block text-sm font-medium text-gray-700 mb-2">
                Rate (₹/sq ft) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  id="customRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={useCustomRate ? customRate : (materials.find(m => m.id === materialId)?.ratePerSqft || '')}
                  onChange={(e) => {
                    setUseCustomRate(true);
                    setCustomRate(e.target.value);
                  }}
                  placeholder="0"
                  className="w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">/sq ft</span>
              </div>
              {materialId && !useCustomRate && (
                <div className="text-xs text-green-600 mt-1">
                  Using admin rate: ₹{materials.find(m => m.id === materialId)?.ratePerSqft || 0}/sq ft
                </div>
              )}
            </div>
          </div>



          {/* Note */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
              Note (Optional)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any additional notes about this item..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Preview Calculation */}
          {preview && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center space-x-2 mb-3">
                <Calculator className="h-5 w-5 text-amber-600" />
                <h4 className="text-sm font-medium text-amber-800">Calculation Preview</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-amber-700">Formula:</span>
                  <span className="text-amber-900 font-mono">({length} × {width}) ÷ 92903</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Square Feet:</span>
                  <span className="text-amber-900 font-medium">{preview.sqft} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Material Rate:</span>
                  <span className="text-amber-900">₹{preview.rate}/sq ft ({preview.material})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Quantity:</span>
                  <span className="text-amber-900">{quantity}</span>
                </div>
                <div className="flex justify-between border-t border-amber-300 pt-2">
                  <span className="text-amber-700 font-medium">Total Amount:</span>
                  <div className="flex items-center text-amber-900 font-bold">
                    <span className="mr-1">₹</span>
                    {preview.amount.toFixed(2)}
                  </div>
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
            <span>{editingItem ? 'Update' : 'Add'} Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
