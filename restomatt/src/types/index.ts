export interface Project {
  id: string;
  name: string;
  typeId: string;
  customerName?: string;
  customerMobile?: string;
  customerAddress?: string;
  items: ProjectItem[];
  extraCosts: ExtraCost[];
  milestones: Milestone[];
  photos: ProjectPhoto[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  length: number; // in inches
  width: number; // in inches
  depth: number; // in inches
  materialId: string;
  quantity: number;
  note?: string;
  sqft: number;
  amount: number;
  customRate?: number; // Allow users to override admin material rate
}

export interface ExtraCost {
  id: string;
  name: string;
  amount: number; // can be positive or negative
  note?: string;
}

export interface ProjectType {
  id: string;
  name: string;
  icon: string;
  description: string;
  materials: Material[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Material {
  id: string;
  name: string;
  ratePerSqft: number;
  projectTypeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
}

export interface DimensionType {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  required: boolean;
}

export interface Dimension {
  id: string;
  typeId: string;
  value: number;
  name: string;
  unit: string;
}

export interface Milestone {
  id: string;
  name: string;
  description?: string;
  dueDate?: Date;
  completedDate?: Date;
  status: 'pending' | 'in-progress' | 'completed';
  order: number;
}

export interface ProjectPhoto {
  id: string;
  url: string;
  fileName: string;
  caption?: string;
  type: 'before' | 'progress' | 'after' | 'material';
  uploadedAt: Date;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description?: string;
  typeId: string;
  items: Omit<ProjectItem, 'id' | 'sqft' | 'amount'>[];
  extraCosts: Omit<ExtraCost, 'id'>[];
  createdAt: Date;
  userId: string;
}
