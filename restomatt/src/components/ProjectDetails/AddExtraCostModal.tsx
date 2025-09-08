import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Minus } from 'lucide-react';
import { ExtraCost } from '../../types';

interface AddExtraCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExtraCost: (extraCost: {
    name: string;
    amount: number;
    note?: string;
  }) => void;
  editingExtraCost?: ExtraCost | null;
}

const AddExtraCostModal: React.FC<AddExtraCostModalProps> = ({
  isOpen,
  onClose,
  onAddExtraCost,
  editingExtraCost,
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isPositive, setIsPositive] = useState(true);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (editingExtraCost) {
      setName(editingExtraCost.name);
      setAmount(Math.abs(editingExtraCost.amount).toString());
      setIsPositive(editingExtraCost.amount >= 0);
      setNote(editingExtraCost.note || '');
    } else {
      setName('');
      setAmount('');
      setIsPositive(true);
      setNote('');
    }
  }, [editingExtraCost, isOpen]);

  const handleClose = () => {
    setName('');
    setAmount('');
    setIsPositive(true);
    setNote('');
    onClose();
  };

  const handleSubmit = () => {
    const amountNum = parseFloat(amount);
    
    if (name.trim() && !isNaN(amountNum) && amountNum > 0) {
      const extraCostData: any = {
        name: name.trim(),
        amount: isPositive ? amountNum : -amountNum,
      };

      // Only add note if it has content
      if (note.trim()) {
        extraCostData.note = note.trim();
      }

      onAddExtraCost(extraCostData);
      handleClose();
    }
  };

  const canSubmit = name.trim().length > 0 && 
                   !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingExtraCost ? 'Edit Extra Cost' : 'Add Extra Cost'}
            </h2>
            <p className="text-sm text-gray-500">
              {editingExtraCost ? 'Update extra cost details' : 'Add additional costs or discounts to your project'}
            </p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Cost Name */}
          <div>
            <label htmlFor="cost-name" className="block text-sm font-medium text-gray-700 mb-2">
              Cost Name *
            </label>
            <input
              id="cost-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Installation, Delivery, Discount"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Amount Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost Type *
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setIsPositive(true)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  isPositive
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300 text-gray-600'
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>Additional Cost</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPositive(false)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  !isPositive
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-red-300 text-gray-600'
                }`}
              >
                <Minus className="h-4 w-4" />
                <span>Discount</span>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (Rs) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">₹</span>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label htmlFor="cost-note" className="block text-sm font-medium text-gray-700 mb-2">
              Note (Optional)
            </label>
            <textarea
              id="cost-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any additional details about this cost..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
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
            <span>{editingExtraCost ? 'Update' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExtraCostModal;
