import React, { useState, useEffect } from 'react';
import { X, Check, Calculator } from 'lucide-react';
import { Material, ProjectItem, ItemGroup } from '../../types';

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
    groupId?: string;
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
    groupId?: string;
  }) => void;
  materials: (Material & { displayName?: string })[];
  itemGroups?: ItemGroup[];
  editingItem?: ProjectItem | null;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  materials,
  itemGroups = [],
  editingItem,
}) => {
  const [name, setName] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [groupId, setGroupId] = useState('');
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
      setGroupId(editingItem.groupId || '');
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
      setGroupId('');
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
        groupId: groupId || undefined,
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
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header - Compact */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button onClick={handleClose} className="p-1.5 hover:bg-gray-200 rounded transition-colors">
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Content - Compact & Organized */}
        <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Row 1: Name & Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="item-name" className="block text-xs font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                id="item-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Cabinet Door, Shelf"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Group Selection - Moved to top */}
            {itemGroups && itemGroups.length > 0 && (
              <div>
                <label htmlFor="group" className="block text-xs font-medium text-gray-700 mb-1">
                  Group
                </label>
                <select
                  id="group"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">No Group</option>
                  {itemGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Row 2: Dimensions - Responsive: 2 cols on mobile, 4 on larger screens */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label htmlFor="width" className="block text-xs font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="length" className="block text-xs font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="depth" className="block text-xs font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-xs font-medium text-gray-700 mb-1">
                Qty *
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 3: Material & Rate - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="material" className="block text-xs font-medium text-gray-700 mb-1">
                Material *
              </label>
              <select
                id="material"
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Select material</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="customRate" className="block text-xs font-medium text-gray-700 mb-1">
                Rate (₹/sq ft) *
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">₹</span>
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
                  className="w-full pl-6 pr-14 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <span className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">/sq ft</span>
              </div>
              {materialId && !useCustomRate && (
                <div className="text-xs text-green-600 mt-0.5">
                  Admin: ₹{materials.find(m => m.id === materialId)?.ratePerSqft || 0}/sq ft
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Note - Optional */}
          <div>
            <label htmlFor="note" className="block text-xs font-medium text-gray-700 mb-1">
              Note (Optional)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Additional notes..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Preview Calculation - Compact & Responsive */}
          {preview && (
            <div className="bg-amber-50 rounded border border-amber-200 p-3">
              <div className="flex items-center space-x-1.5 mb-2">
                <Calculator className="h-4 w-4 text-amber-600" />
                <h4 className="text-xs font-semibold text-amber-800">Preview</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-amber-700">Sq Ft:</span>
                  <span className="text-amber-900 font-medium">{preview.sqft}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Rate:</span>
                  <span className="text-amber-900">₹{preview.rate}/sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Qty:</span>
                  <span className="text-amber-900">{quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700 font-semibold">Total:</span>
                  <span className="text-amber-900 font-bold">₹{preview.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Compact & Responsive */}
        <div className="px-4 sm:px-5 py-3 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2 sm:py-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full sm:w-auto px-5 py-2 sm:py-1.5 text-sm rounded transition-colors flex items-center justify-center space-x-1.5 order-1 sm:order-2 ${
              canSubmit
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            <span>{editingItem ? 'Update' : 'Add'} Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
