export interface Project {
  id: string;
  name: string;
  typeId: string;
  customerName?: string;
  customerMobile?: string;
  customerAddress?: string;
  items: ProjectItem[];
  itemGroups?: ItemGroup[];
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
  groupId?: string; // Optional group assignment
}

export interface ItemGroup {
  id: string;
  name: string;
  order: number;
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

export interface Lead {
  id: string;
  businessName: string;
  contactPerson: string;
  mobileNumber: string;
  address: string;
  status: LeadStatus;
  userId: string;
  followUpNotes: FollowUpNote[];
  createdAt: Date;
  updatedAt: Date;
  lastFollowUpDate?: Date;
  convertedToProjectId?: string;
}

export type LeadStatus =
  | 'New Lead'
  | 'Interested'
  | 'Unanswered'
  | 'Busy'
  | 'Not Interested'
  | 'Converted';

export interface FollowUpNote {
  id: string;
  note: string;
  createdAt: Date;
  createdBy: string;
  createdByName: string;
}

export interface DayActivity {
  id: string;
  date: Date;
  summary: string;
  rating: 1 | 2 | 3 | 4 | 5;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: Date; // Normalized to start of day for querying
  checkInTime?: Date;
  checkInLocation?: GeoLocation;
  checkOutTime?: Date;
  checkOutLocation?: GeoLocation;
  totalHours?: number;
  status: 'checked-in' | 'checked-out' | 'absent' | 'leave';
  leaveReason?: string; // For planned leaves
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
