// ─── Pipeline Stages ─────────────────────────────────────────────────────────

export type PipelineStage =
  | 'lead'
  | 'prospect'
  | 'application'
  | 'processing'
  | 'underwriting'
  | 'approved'
  | 'clear-to-close'
  | 'funded'
  | 'withdrawn'
  | 'suspended'
  | 'dead';

export const STAGE_CONFIG: Record<PipelineStage, { label: string; color: string; bgColor: string }> = {
  lead:             { label: 'Lead',            color: '#6b7280', bgColor: '#f3f4f6' },
  prospect:         { label: 'Prospect',        color: '#a855f7', bgColor: '#faf5ff' },
  application:      { label: 'Application',     color: '#3b82f6', bgColor: '#eff6ff' },
  processing:       { label: 'Processing',      color: '#8b5cf6', bgColor: '#f5f3ff' },
  underwriting:     { label: 'Underwriting',    color: '#f59e0b', bgColor: '#fffbeb' },
  approved:         { label: 'Approved',        color: '#10b981', bgColor: '#ecfdf5' },
  'clear-to-close': { label: 'Clear to Close',  color: '#06b6d4', bgColor: '#ecfeff' },
  funded:           { label: 'Funded',          color: '#22c55e', bgColor: '#f0fdf4' },
  withdrawn:        { label: 'Withdrawn',       color: '#f97316', bgColor: '#fff7ed' },
  suspended:        { label: 'Suspended',       color: '#eab308', bgColor: '#fefce8' },
  dead:             { label: 'Dead',            color: '#ef4444', bgColor: '#fef2f2' },
};

// Active pipeline stages (excludes terminal outcomes)
export const PIPELINE_ACTIVE_STAGES: PipelineStage[] = [
  'lead',
  'prospect',
  'application',
  'processing',
  'underwriting',
  'approved',
  'clear-to-close',
];

// All stages in order for pipeline view
export const PIPELINE_STAGES: PipelineStage[] = [
  'lead',
  'prospect',
  'application',
  'processing',
  'underwriting',
  'approved',
  'clear-to-close',
  'funded',
  'withdrawn',
  'suspended',
  'dead',
];

// ─── Loan ────────────────────────────────────────────────────────────────────

export interface Loan {
  id: string;
  loanNumber?: string;

  // Borrower
  borrowerName: string;
  borrowerName2?: string;
  email: string;
  phone: string;

  // Property
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
  county?: string;
  propertyType: 'sfr' | 'condo' | 'townhouse' | '2-4unit' | '5+unit';
  propertyValue: number;
  appraisalValue?: number;

  // Loan
  loanAmount: number;
  loanPurpose: 'purchase' | 'refinance' | 'cashout';
  occupancy: 'primary' | 'secondary' | 'investment';
  loanType: 'conventional' | 'fha' | 'va' | 'nonqm' | 'jumbo';
  docType: 'fullDoc' | 'bankStatement' | 'dscr' | 'assetDepletion' | 'other';
  program?: string;

  // Ratios
  creditScore: number;
  ltv: number;
  cltv?: number;
  dti?: number;

  // Financials
  monthlyIncome?: number;
  housingExpense?: number;
  downPayment?: number;
  sellerCredit?: number;
  lenderCredit?: number;
  estimatedClosingCosts?: number;

  // Rate & Lock
  rate?: number;
  lockDate?: string;
  lockDays?: number;
  lockExpiry?: string;

  // Team
  loanOfficer?: string;
  processor?: string;
  assignedTo: string;

  // Status & Dates
  status: PipelineStage;
  closingDate?: string;
  fundingDate?: string;
  createdAt: string;
  updatedAt: string;

  // Legacy
  notes?: string;
}

// ─── Task ────────────────────────────────────────────────────────────────────

export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TaskCategory = 'conditions' | 'documents' | 'follow-up' | 'closing' | 'compliance' | 'other';

export interface Task {
  id: string;
  loanId: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  assignedTo?: string;
  priority: TaskPriority;
  category: TaskCategory;
  createdAt: string;
  updatedAt: string;
}

// ─── Activity ────────────────────────────────────────────────────────────────

export interface LoanActivity {
  id: string;
  loanId: string;
  action: string;
  description: string;
  performedBy: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ─── Note ────────────────────────────────────────────────────────────────────

export interface LoanNote {
  id: string;
  loanId: string;
  content: string;
  author: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Document ────────────────────────────────────────────────────────────────

export type DocumentStatus = 'pending' | 'received' | 'reviewed' | 'approved' | 'rejected';
export type DocumentCategory =
  | 'application'
  | 'income'
  | 'assets'
  | 'credit'
  | 'property'
  | 'title'
  | 'insurance'
  | 'closing'
  | 'other';

export interface LoanDocument {
  id: string;
  loanId: string;
  name: string;
  category: DocumentCategory;
  fileUrl?: string;
  fileSize?: number;
  uploadedBy: string;
  status: DocumentStatus;
  notes?: string;
  createdAt: string;
}

// ─── Condition ──────────────────────────────────────────────────────────────

export type ConditionType = 'ptd' | 'ptf' | 'ptc';
export type ConditionStatus = 'open' | 'requested' | 'received' | 'cleared' | 'waived';

export interface LoanCondition {
  id: string;
  loanId: string;
  conditionType: ConditionType;
  title: string;
  description?: string;
  status: ConditionStatus;
  addedBy: string;
  clearedBy?: string;
  clearedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: 'borrower' | 'realtor' | 'attorney' | 'title' | 'other';
  loans: string[];
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  licenseNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}
