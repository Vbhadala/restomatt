import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit3, Trash2, Calculator, DollarSign, MessageCircle, FileText, Check, X, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Project, ProjectType, Material, ProjectItem, ExtraCost, Milestone, ProjectPhoto } from '../../types';
import AddItemModal from './AddItemModal';
import AddExtraCostModal from './AddExtraCostModal';
import ProjectTimeline from './ProjectTimeline';
import ProjectPhotoGallery from './ProjectPhotoGallery';

interface ProjectDetailsProps {
  project: Project;
  projectTypes: ProjectType[];
  onBack: () => void;
  onUpdateProject: (project: Project) => void;
  addProjectItem: (projectId: string, item: Omit<ProjectItem, 'id' | 'sqft' | 'amount'>, materialRate: number) => Promise<ProjectItem>;
  updateProjectItem: (projectId: string, itemId: string, updates: Partial<ProjectItem>, materialRate: number) => Promise<void>;
  deleteProjectItem: (projectId: string, itemId: string) => Promise<void>;
  addExtraCost: (projectId: string, extraCost: Omit<ExtraCost, 'id'>) => Promise<ExtraCost>;
  updateExtraCost: (projectId: string, extraCostId: string, updates: Partial<ExtraCost>) => Promise<void>;
  deleteExtraCost: (projectId: string, extraCostId: string) => Promise<void>;
  addMilestone: (projectId: string, milestone: Omit<Milestone, 'id'>) => Promise<Milestone>;
  updateMilestone: (projectId: string, milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (projectId: string, milestoneId: string) => Promise<void>;
  addProjectPhoto: (projectId: string, photo: Omit<ProjectPhoto, 'id' | 'uploadedAt'>) => Promise<ProjectPhoto>;
  updateProjectPhoto: (projectId: string, photoId: string, updates: Partial<ProjectPhoto>) => Promise<void>;
  deleteProjectPhoto: (projectId: string, photoId: string) => Promise<void>;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  projectTypes,
  onBack,
  onUpdateProject,
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
}) => {
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isAddExtraCostModalOpen, setIsAddExtraCostModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);
  const [editingExtraCost, setEditingExtraCost] = useState<ExtraCost | null>(null);
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [editedProjectName, setEditedProjectName] = useState(project.name);
  const [isEditingCustomerInfo, setIsEditingCustomerInfo] = useState(false);
  const [editedCustomerName, setEditedCustomerName] = useState(project.customerName || '');
  const [editedCustomerMobile, setEditedCustomerMobile] = useState(project.customerMobile || '');
  const [editedCustomerAddress, setEditedCustomerAddress] = useState(project.customerAddress || '');

  const projectType = projectTypes.find(pt => pt.id === project.typeId);

  // Get all materials from all project types for the dropdown
  const allMaterials = projectTypes.flatMap(type =>
    (type.materials || []).map(material => ({
      ...material,
      typeName: type.name,
      displayName: `${material.name} - ${type.name} (₹${material.ratePerSqft}/sq ft)`
    }))
  );

  const handleSaveProjectName = () => {
    if (editedProjectName.trim() && editedProjectName.trim() !== project.name) {
      const updatedProject = {
        ...project,
        name: editedProjectName.trim(),
        updatedAt: new Date()
      };
      onUpdateProject(updatedProject);
    }
    setIsEditingProjectName(false);
  };

  const handleCancelEditProjectName = () => {
    setEditedProjectName(project.name);
    setIsEditingProjectName(false);
  };

  const handleSaveCustomerInfo = () => {
    const updatedProject = {
      ...project,
      customerName: editedCustomerName.trim() || undefined,
      customerMobile: editedCustomerMobile.trim() || undefined,
      customerAddress: editedCustomerAddress.trim() || undefined,
      updatedAt: new Date()
    };
    onUpdateProject(updatedProject);
    setIsEditingCustomerInfo(false);
  };

  const handleCancelEditCustomerInfo = () => {
    setEditedCustomerName(project.customerName || '');
    setEditedCustomerMobile(project.customerMobile || '');
    setEditedCustomerAddress(project.customerAddress || '');
    setIsEditingCustomerInfo(false);
  };
  const handleAddItem = async (itemData: {
    name: string;
    length: number;
    width: number;
    depth: number;
    materialId: string;
    quantity: number;
    note?: string;
    customRate?: number;
  }) => {
    const material = allMaterials.find(m => m.id === itemData.materialId);
    if (material) {
      try {
        // Ensure all data is properly formatted and no undefined values
        const cleanItemData: any = {
          name: String(itemData.name || '').trim() || 'Unnamed Item',
          length: Number(itemData.length) || 0,
          width: Number(itemData.width) || 0,
          depth: Number(itemData.depth) || 0,
          materialId: String(itemData.materialId || '').trim(),
          quantity: Number(itemData.quantity) || 1,
          note: (itemData.note && String(itemData.note).trim() !== '') ? String(itemData.note).trim() : '',
        };

        // Only add customRate if it has a valid value (not undefined)
        if (typeof itemData.customRate === 'number' && !isNaN(itemData.customRate)) {
          cleanItemData.customRate = itemData.customRate;
        }

        // Use custom rate if provided, otherwise use admin rate
        const rateToUse = itemData.customRate || material.ratePerSqft;
        await addProjectItem(project.id, cleanItemData, rateToUse);
        // The hook will automatically update the project state via real-time listener
        // No need to manually update here as it would cause duplicates
        setIsAddItemModalOpen(false);
      } catch (error) {
        console.error('Error adding item:', error);
        console.error('Item data:', itemData);
        // You might want to show an error message to the user here
      }
    }
  };

  const handleEditItem = (item: ProjectItem) => {
    setEditingItem(item);
    setIsAddItemModalOpen(true);
  };

  const handleUpdateItem = (itemData: {
    name: string;
    length: number;
    width: number;
    depth: number;
    materialId: string;
    quantity: number;
    note?: string;
    customRate?: number;
  }) => {
    if (editingItem) {
      const material = allMaterials.find(m => m.id === itemData.materialId);
      if (material) {
        const rateToUse = itemData.customRate || material.ratePerSqft;
        updateProjectItem(project.id, editingItem.id, itemData, rateToUse);

        // Calculate updated values
        const sqft = (itemData.length * itemData.width ) / 92903;
        const amount = sqft * rateToUse * itemData.quantity;

        // Update the project with the modified item
        const updatedItems = project.items.map(item =>
          item.id === editingItem.id
            ? {
                ...item,
                ...itemData,
                sqft: Math.round(sqft * 100) / 100,
                amount: Math.round(amount * 100) / 100,
              }
            : item
        );

        const updatedProject = {
          ...project,
          items: updatedItems,
          updatedAt: new Date()
        };
        onUpdateProject(updatedProject);
        setEditingItem(null);
        setIsAddItemModalOpen(false);
      }
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteProjectItem(project.id, itemId);
      
      // Update the project by removing the item
      const updatedItems = project.items.filter(item => item.id !== itemId);
      const updatedProject = {
        ...project,
        items: updatedItems,
        updatedAt: new Date()
      };
      onUpdateProject(updatedProject);
    }
  };

  const handleAddExtraCost = async (extraCostData: {
    name: string;
    amount: number;
    note?: string;
  }) => {
    try {
      const newExtraCost = await addExtraCost(project.id, extraCostData);
      // The hook will automatically update the project state via real-time listener
      // No need to manually update here as it would cause duplicates
      setIsAddExtraCostModalOpen(false);
    } catch (error) {
      console.error('Error adding extra cost:', error);
    }
  };

  const handleEditExtraCost = (extraCost: ExtraCost) => {
    setEditingExtraCost(extraCost);
    setIsAddExtraCostModalOpen(true);
  };

  const handleUpdateExtraCost = (extraCostData: {
    name: string;
    amount: number;
    note?: string;
  }) => {
    if (editingExtraCost) {
      updateExtraCost(project.id, editingExtraCost.id, extraCostData);
      
      // Update the project with the modified extra cost
      const updatedExtraCosts = (project.extraCosts || []).map(cost => 
        cost.id === editingExtraCost.id 
          ? { ...cost, ...extraCostData }
          : cost
      );
      
      const updatedProject = {
        ...project,
        extraCosts: updatedExtraCosts,
        updatedAt: new Date()
      };
      onUpdateProject(updatedProject);
      setEditingExtraCost(null);
      setIsAddExtraCostModalOpen(false);
    }
  };

  const handleDeleteExtraCost = (extraCostId: string) => {
    if (window.confirm('Are you sure you want to delete this extra cost?')) {
      deleteExtraCost(project.id, extraCostId);
      
      // Update the project by removing the extra cost
      const updatedExtraCosts = (project.extraCosts || []).filter(cost => cost.id !== extraCostId);
      const updatedProject = {
        ...project,
        extraCosts: updatedExtraCosts,
        updatedAt: new Date()
      };
      onUpdateProject(updatedProject);
    }
  };

  const handleCloseModals = () => {
    setIsAddItemModalOpen(false);
    setIsAddExtraCostModalOpen(false);
    setEditingItem(null);
    setEditingExtraCost(null);
  };

  const getProjectItemsTotal = () => {
    return (project.items || []).reduce((total, item) => total + (item.amount || 0), 0);
  };

  const getExtraCostsTotal = () => {
    return (project.extraCosts || []).reduce((total, cost) => total + (cost.amount || 0), 0);
  };

  const getFinalTotal = () => {
    return getProjectItemsTotal() + getExtraCostsTotal();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Set up colors
    const primaryColor: [number, number, number] = [217, 119, 6]; // Amber color
    const secondaryColor: [number, number, number] = [255, 255, 255];
    const textColor: [number, number, number] = [33, 33, 33];

    // Company Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 35, 'F');

    // Company Logo/Text
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('RESTOMATT', 20, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Furniture Solutions', 20, 32);
    doc.text('Phone: +91 96364 77399 | Email: info@restomatt.com', pageWidth - 20, 32, { align: 'right' });

    // Invoice Title
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 40, pageWidth, 15, 'F');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('QUOTATION', pageWidth / 2, 52, { align: 'center' });

    // Quotation Details
    let yPos = 70;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Left side - Quotation Info
    doc.text(`Quotation #: Q${project.id.slice(-6).toUpperCase()}`, 20, yPos);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, yPos + 7);
    doc.text(`Valid Until: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}`, 20, yPos + 14);

    // Right side - Customer Info
    const customerX = pageWidth / 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', customerX, yPos);
    doc.setFont('helvetica', 'normal');

    let customerY = yPos + 7;
    if (project.customerName) {
      doc.text(`Customer: ${project.customerName}`, customerX, customerY);
      customerY += 7;
    }
    if (project.customerMobile) {
      doc.text(`Phone: ${project.customerMobile}`, customerX, customerY);
      customerY += 7;
    }
    if (project.customerAddress) {
      doc.text(`Address: ${project.customerAddress}`, customerX, customerY);
      customerY += 7;
    }

    yPos += 40;

    // Project Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Project: ${project.name}`, 20, yPos);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Type: ${projectType?.name || 'Custom Furniture'}`, 20, yPos + 8);

    yPos += 25;

    // Items Table
    if (project.items && project.items.length > 0) {
      const tableData = project.items.map(item => [
        item.name || 'Unnamed Item',
        `${item.width || 0}" × ${item.length || 0}" × ${item.depth || 0}"`,
        getMaterialName(item.materialId || ''),
        `Rs ${getActualMaterialRate(item).toFixed(2)}`,
        `${item.quantity || ''}`,
        `Rs ${(item.amount || 0).toFixed(2)}`
      ]);

      autoTable(doc, {
        head: [['Item Description', 'Dimensions (WxLxD)', 'Material', 'Rate (Rs/Sq Ft)', 'Quantity', 'Amount (Rs)']],
        body: tableData,
        startY: yPos,
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        headStyles: {
          fillColor: primaryColor,
          textColor: textColor,
          fontSize: 10,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 15 },
          5: { cellWidth: 25 }
        },
        margin: { left: 20, right: 20 }
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Additional Costs
    if (project.extraCosts && project.extraCosts.length > 0) {
      const extraCostsData = project.extraCosts.map(cost => [
        cost.name || 'Unnamed Cost',
        cost.note || '',
        `Rs ${Math.abs(cost.amount || 0).toFixed(2)}`
      ]);

      autoTable(doc, {
        head: [['Additional Service', 'Description', 'Amount']],
        body: extraCostsData,
        startY: yPos,
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        headStyles: {
          fillColor: primaryColor,
          textColor: textColor,
          fontSize: 10,
          fontStyle: 'bold'
        },
        margin: { left: 20, right: 20 }
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Totals Section
    const projectItemsTotal = getProjectItemsTotal();
    const extraCostsTotal = getExtraCostsTotal();
    const finalTotal = getFinalTotal();

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // Subtotal
    doc.text(`Subtotal: Rs ${projectItemsTotal.toFixed(2)}`, pageWidth - 60, yPos, { align: 'right' });
    yPos += 8;

    // Additional costs
    if (extraCostsTotal !== 0) {
      doc.text(`Additional Costs: Rs ${extraCostsTotal.toFixed(2)}`, pageWidth - 60, yPos, { align: 'right' });
      yPos += 8;
    }

    // Total
    doc.setLineWidth(0.5);
    doc.line(20, yPos - 3, pageWidth - 20, yPos - 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text(`GRAND TOTAL: Rs ${finalTotal.toFixed(2)}`, pageWidth - 60, yPos + 8, { align: 'right' });

    yPos += 25;

    // Terms & Conditions
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text('Terms & Conditions:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    const terms = [
      '• 50% advance payment required to commence work',
      '• Balance payment due upon completion',
      '• Installation included in the quoted price',
      '• Warranty: 2 years on workmanship, 1 year on materials',
      '• Free delivery within city limits',
      '• Quote valid for 30 days from issue date'
    ];

    terms.forEach((term, index) => {
      doc.text(term, 25, yPos + 8 + (index * 5));
    });

    yPos += terms.length * 5 + 15;

    // Footer
    doc.setFillColor(...primaryColor);
    doc.rect(0, yPos, pageWidth, 20, 'F');
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(8);
    doc.text('Thank you for your business!', pageWidth / 2, yPos + 8, { align: 'center' });
    doc.text('www.restomatt.com | +91 96364 77399 | info@restomatt.com', pageWidth / 2, yPos + 13, { align: 'center' });

    // Page number
    doc.setFontSize(6);
    doc.text(`Generated on ${new Date().toLocaleString('en-IN')} | Quote ID: Q${project.id.slice(-6).toUpperCase()}`, 20, yPos + 15);

    // Save the PDF
    doc.save(`${project.customerName || 'Client'}_${project.name}_quotation.pdf`);
  };

  const getMaterialName = (materialId: string) => {
    return allMaterials.find(m => m.id === materialId)?.name || 'Unknown Material';
  };

  const getMaterialRate = (materialId: string) => {
    return allMaterials.find(m => m.id === materialId)?.ratePerSqft || 0;
  };

  const getActualMaterialRate = (item: ProjectItem) => {
    // Return custom rate if it exists, otherwise return the admin rate
    return item.customRate !== undefined ? item.customRate : getMaterialRate(item.materialId || '');
  };

  const handleBookNow = () => {
    const projectItemsTotal = getProjectItemsTotal();
    const extraCostsTotal = getExtraCostsTotal();
    const finalTotal = getFinalTotal();
    
    const message = `Hi! I'd like to book the following project:

*Project:* ${project.name}
*Type:* ${projectType?.name}
${project.customerName ? `*Customer:* ${project.customerName}` : ''}
${project.customerMobile ? `*Mobile:* ${project.customerMobile}` : ''}
${project.customerAddress ? `*Address:* ${project.customerAddress}` : ''}

*Project Items Total:* ₹${projectItemsTotal.toFixed(2)}
*Additional Costs:* ${extraCostsTotal >= 0 ? '+' : ''}₹${extraCostsTotal.toFixed(2)}
*Final Total:* ₹${finalTotal.toFixed(2)}

*Items (${project.items.length}):*
${(project.items || []).map(item => `• ${item.name || 'Unnamed Item'} - ${item.width || 0}"×${item.length || 0}"×${item.depth || 0}" (${item.quantity || 1}x) - ₹${(item.amount || 0).toFixed(2)}`).join('\n')}

${(project.extraCosts || []).length > 0 ? `
*Extra Costs (${project.extraCosts.length}):*
${(project.extraCosts || []).map(cost => `• ${cost.name || 'Unnamed Cost'} - ${(cost.amount || 0) >= 0 ? '+' : ''}₹${Math.abs(cost.amount || 0).toFixed(2)}`).join('\n')}
` : ''}

Please confirm the booking and next steps.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919636477399?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects</span>
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            {isEditingProjectName ? (
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={editedProjectName}
                  onChange={(e) => setEditedProjectName(e.target.value)}
                  className="text-2xl font-bold text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveProjectName();
                    if (e.key === 'Escape') handleCancelEditProjectName();
                  }}
                />
                <button
                  onClick={handleSaveProjectName}
                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  title="Save project name"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={handleCancelEditProjectName}
                  className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Cancel editing"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <button
                  onClick={() => setIsEditingProjectName(true)}
                  className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Edit project name"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            )}
            <p className="text-gray-600 mt-2">{projectType?.name} Project</p>
          </div>
          
          {/* Customer Information Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Customer Information</h3>
              {!isEditingCustomerInfo && (
                <button
                  onClick={() => setIsEditingCustomerInfo(true)}
                  className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                  title="Edit customer information"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {isEditingCustomerInfo ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={editedCustomerName}
                      onChange={(e) => setEditedCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={editedCustomerMobile}
                      onChange={(e) => setEditedCustomerMobile(e.target.value)}
                      placeholder="Enter mobile number"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                  <textarea
                    value={editedCustomerAddress}
                    onChange={(e) => setEditedCustomerAddress(e.target.value)}
                    placeholder="Enter customer address"
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveCustomerInfo}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center space-x-1"
                  >
                    <Check className="h-3 w-3" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancelEditCustomerInfo}
                    className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center space-x-1"
                  >
                    <X className="h-3 w-3" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium text-gray-900">{project.customerName || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Mobile:</span>
                  <p className="font-medium text-gray-900">{project.customerMobile || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Address:</span>
                  <p className="font-medium text-gray-900">{project.customerAddress || 'Not specified'}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-2 px-4 py-2 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Project Items</h2>
          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
        </div>

        {(project.items || []).length === 0 ? (
          <div className="text-center py-12">
            <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items added yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first item to this project</p>
            <button
              onClick={() => setIsAddItemModalOpen(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add First Item</span>
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dimensions (W×L×D)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate/Sq Ft
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Sq Ft
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(project.items || []).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name || 'Unnamed Item'}</div>
                          {item.note && (
                            <div className="flex items-start space-x-1 mt-1">
                              <FileText className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div className="text-xs text-gray-500 leading-relaxed">{item.note}</div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.width || 0} × {item.length || 0} × {item.depth || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getMaterialName(item.materialId || '')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{getActualMaterialRate(item).toFixed(2)}/sq ft
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity || 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.sqft || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-green-600">
                          <span className="mr-1">₹</span>
                          {(item.amount || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-amber-600 hover:text-amber-900 transition-colors"
                            title="Edit item"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Project Items Subtotal */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Project Items Subtotal:</span>
                <div className="flex items-center text-xl font-bold text-green-600">
                  <span className="mr-1">₹</span>
                  {getProjectItemsTotal().toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Extra Costs Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Additional Costs</h2>
          <button
            onClick={() => setIsAddExtraCostModalOpen(true)}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Cost</span>
          </button>
        </div>

        {(!project.extraCosts || project.extraCosts.length === 0) ? (
          <div className="text-center py-8">
            <DollarSign className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No additional costs added</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {(project.extraCosts || []).map((cost) => (
                <div key={cost.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{cost.name || 'Unnamed Cost'}</span>
                        {cost.note && (
                          <div className="flex items-center space-x-1">
                            <FileText className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{cost.note}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center font-medium ${
                        (cost.amount || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(cost.amount || 0) >= 0 ? '+' : ''}
                        <span className="mr-1">₹</span>
                        {Math.abs(cost.amount || 0).toFixed(2)}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditExtraCost(cost)}
                          className="text-amber-600 hover:text-amber-900 transition-colors"
                          title="Edit extra cost"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExtraCost(cost.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete extra cost"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Extra Costs Subtotal */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Additional Costs Total:</span>
                <div className={`flex items-center text-xl font-bold ${
                  getExtraCostsTotal() >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {getExtraCostsTotal() >= 0 ? '+' : ''}
                  <span className="mr-1">₹</span>
                  {Math.abs(getExtraCostsTotal()).toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Project Timeline */}
      <ProjectTimeline
        milestones={project.milestones}
        onAddMilestone={(milestone) => addMilestone(project.id, milestone)}
        onUpdateMilestone={(milestoneId, updates) => updateMilestone(project.id, milestoneId, updates)}
        onDeleteMilestone={(milestoneId) => deleteMilestone(project.id, milestoneId)}
      />

      {/* Project Photo Gallery */}
      <ProjectPhotoGallery
        photos={project.photos}
        onAddPhoto={(photo) => addProjectPhoto(project.id, photo)}
        onUpdatePhoto={(photoId, updates) => updateProjectPhoto(project.id, photoId, updates)}
        onDeletePhoto={(photoId) => deleteProjectPhoto(project.id, photoId)}
      />

      {/* Final Total and Book Now */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-2xl font-bold text-gray-900">Final Total:</span>
            <div className="flex items-center text-3xl font-bold text-amber-600">
              <span className="mr-2">₹</span>
              {getFinalTotal().toFixed(2)}
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleBookNow}
              className="flex items-center space-x-3 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="h-6 w-6" />
              <span>Book Now via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={handleCloseModals}
        onAddItem={editingItem ? handleUpdateItem : handleAddItem}
        materials={allMaterials}
        editingItem={editingItem}
      />

      <AddExtraCostModal
        isOpen={isAddExtraCostModalOpen}
        onClose={handleCloseModals}
        onAddExtraCost={editingExtraCost ? handleUpdateExtraCost : handleAddExtraCost}
        editingExtraCost={editingExtraCost}
      />
    </div>
  );
};

export default ProjectDetails;
