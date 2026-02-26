export type PipelineStage =
  | 'lead'
  | 'application'
  | 'processing'
  | 'underwriting'
  | 'approved'
  | 'clear-to-close'
  | 'funded'
  | 'dead';

export interface Loan {
  id: string;
  borrowerName: string;
  email: string;
  phone: string;
  loanAmount: number;
  propertyValue: number;
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
  propertyType: 'sfr' | 'condo' | 'townhouse' | '2-4unit' | '5+unit';
  loanPurpose: 'purchase' | 'refinance' | 'cashout';
  occupancy: 'primary' | 'secondary' | 'investment';
  status: PipelineStage;
  creditScore: number;
  ltv: number;
  loanType: 'conventional' | 'fha' | 'va' | 'nonqm' | 'jumbo';
  docType: 'fullDoc' | 'bankStatement' | 'dscr' | 'assetDepletion' | 'other';
  rate?: number;
  lockExpiry?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  notes?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: 'borrower' | 'realtor' | 'attorney' | 'title' | 'other';
  loans: string[];
  createdAt: string;
}

export const STAGE_CONFIG: Record<PipelineStage, { label: string; color: string; bgColor: string }> = {
  lead:             { label: 'Lead',            color: '#6b7280', bgColor: '#f3f4f6' },
  application:      { label: 'Application',     color: '#3b82f6', bgColor: '#eff6ff' },
  processing:       { label: 'Processing',      color: '#8b5cf6', bgColor: '#f5f3ff' },
  underwriting:     { label: 'Underwriting',    color: '#f59e0b', bgColor: '#fffbeb' },
  approved:         { label: 'Approved',         color: '#10b981', bgColor: '#ecfdf5' },
  'clear-to-close': { label: 'Clear to Close',  color: '#06b6d4', bgColor: '#ecfeff' },
  funded:           { label: 'Funded',           color: '#22c55e', bgColor: '#f0fdf4' },
  dead:             { label: 'Dead',             color: '#ef4444', bgColor: '#fef2f2' },
};

export const PIPELINE_STAGES: PipelineStage[] = [
  'lead',
  'application',
  'processing',
  'underwriting',
  'approved',
  'clear-to-close',
  'funded',
];
