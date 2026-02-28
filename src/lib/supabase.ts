import { createClient } from '@supabase/supabase-js';
import type {
  Loan,
  Contact,
  Task,
  LoanActivity,
  LoanNote,
  LoanDocument,
  LoanCondition,
  PipelineStage,
  TaskPriority,
  TaskCategory,
  DocumentStatus,
  DocumentCategory,
  ConditionType,
  ConditionStatus,
} from '@/types';

// ─── Client ──────────────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── DB Types (snake_case columns) ───────────────────────────────────────────

export interface DbLoan {
  id: string;
  loan_number: string | null;

  // Borrower
  borrower_name: string;
  borrower_name2: string | null;
  email: string;
  phone: string;

  // Property
  property_address: string;
  property_city: string;
  property_state: string;
  property_zip: string;
  county: string | null;
  property_type: string;
  property_value: string | number;
  appraisal_value: string | number | null;

  // Loan
  loan_amount: string | number;
  loan_purpose: string;
  occupancy: string;
  loan_type: string;
  doc_type: string;
  program: string | null;

  // Ratios
  credit_score: number;
  ltv: string | number;
  cltv: string | number | null;
  dti: string | number | null;

  // Financials
  monthly_income: string | number | null;
  housing_expense: string | number | null;
  down_payment: string | number | null;
  seller_credit: string | number | null;
  lender_credit: string | number | null;
  estimated_closing_costs: string | number | null;

  // Rate & Lock
  rate: string | number | null;
  lock_date: string | null;
  lock_days: number | null;
  lock_expiry: string | null;

  // Team
  loan_officer: string | null;
  processor: string | null;
  assigned_to: string;

  // Status & Dates
  status: string;
  closing_date: string | null;
  funding_date: string | null;
  created_at: string;
  updated_at: string;

  // Legacy
  notes: string | null;
}

export interface DbContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  type: string;
  loans: string[];
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  license_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface DbTask {
  id: string;
  loan_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
  completed_at: string | null;
  assigned_to: string | null;
  priority: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface DbLoanActivity {
  id: string;
  loan_id: string;
  action: string;
  description: string;
  performed_by: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface DbLoanNote {
  id: string;
  loan_id: string;
  content: string;
  author: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbLoanDocument {
  id: string;
  loan_id: string;
  name: string;
  category: string;
  file_url: string | null;
  file_size: number | null;
  uploaded_by: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface DbLoanCondition {
  id: string;
  loan_id: string;
  condition_type: string;
  title: string;
  description: string | null;
  status: string;
  added_by: string;
  cleared_by: string | null;
  cleared_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Converters ──────────────────────────────────────────────────────────────

function num(val: string | number | null | undefined): number {
  if (val === null || val === undefined) return 0;
  return Number(val);
}

function numOpt(val: string | number | null | undefined): number | undefined {
  if (val === null || val === undefined) return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}

export function dbToLoan(row: DbLoan): Loan {
  return {
    id: row.id,
    loanNumber: row.loan_number ?? undefined,

    borrowerName: row.borrower_name,
    borrowerName2: row.borrower_name2 ?? undefined,
    email: row.email,
    phone: row.phone,

    propertyAddress: row.property_address,
    propertyCity: row.property_city,
    propertyState: row.property_state,
    propertyZip: row.property_zip,
    county: row.county ?? undefined,
    propertyType: row.property_type as Loan['propertyType'],
    propertyValue: num(row.property_value),
    appraisalValue: numOpt(row.appraisal_value),

    loanAmount: num(row.loan_amount),
    loanPurpose: row.loan_purpose as Loan['loanPurpose'],
    occupancy: row.occupancy as Loan['occupancy'],
    loanType: row.loan_type as Loan['loanType'],
    docType: row.doc_type as Loan['docType'],
    program: row.program ?? undefined,

    creditScore: row.credit_score,
    ltv: num(row.ltv),
    cltv: numOpt(row.cltv),
    dti: numOpt(row.dti),

    monthlyIncome: numOpt(row.monthly_income),
    housingExpense: numOpt(row.housing_expense),
    downPayment: numOpt(row.down_payment),
    sellerCredit: numOpt(row.seller_credit),
    lenderCredit: numOpt(row.lender_credit),
    estimatedClosingCosts: numOpt(row.estimated_closing_costs),

    rate: numOpt(row.rate),
    lockDate: row.lock_date ?? undefined,
    lockDays: row.lock_days ?? undefined,
    lockExpiry: row.lock_expiry ?? undefined,

    loanOfficer: row.loan_officer ?? undefined,
    processor: row.processor ?? undefined,
    assignedTo: row.assigned_to,

    status: row.status as PipelineStage,
    closingDate: row.closing_date ?? undefined,
    fundingDate: row.funding_date ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,

    notes: row.notes ?? undefined,
  };
}

export function dbToContact(row: DbContact): Contact {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company ?? undefined,
    type: row.type as Contact['type'],
    loans: row.loans ?? [],
    address: row.address ?? undefined,
    city: row.city ?? undefined,
    state: row.state ?? undefined,
    zip: row.zip ?? undefined,
    licenseNumber: row.license_number ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

export function dbToTask(row: DbTask): Task {
  return {
    id: row.id,
    loanId: row.loan_id,
    title: row.title,
    description: row.description ?? undefined,
    dueDate: row.due_date ?? undefined,
    completed: row.completed,
    completedAt: row.completed_at ?? undefined,
    assignedTo: row.assigned_to ?? undefined,
    priority: row.priority as TaskPriority,
    category: row.category as TaskCategory,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function dbToActivity(row: DbLoanActivity): LoanActivity {
  return {
    id: row.id,
    loanId: row.loan_id,
    action: row.action,
    description: row.description,
    performedBy: row.performed_by,
    metadata: row.metadata ?? undefined,
    createdAt: row.created_at,
  };
}

export function dbToNote(row: DbLoanNote): LoanNote {
  return {
    id: row.id,
    loanId: row.loan_id,
    content: row.content,
    author: row.author,
    pinned: row.pinned,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function dbToDocument(row: DbLoanDocument): LoanDocument {
  return {
    id: row.id,
    loanId: row.loan_id,
    name: row.name,
    category: row.category as DocumentCategory,
    fileUrl: row.file_url ?? undefined,
    fileSize: row.file_size ?? undefined,
    uploadedBy: row.uploaded_by,
    status: row.status as DocumentStatus,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

export function dbToCondition(row: DbLoanCondition): LoanCondition {
  return {
    id: row.id,
    loanId: row.loan_id,
    conditionType: row.condition_type as ConditionType,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status as ConditionStatus,
    addedBy: row.added_by,
    clearedBy: row.cleared_by ?? undefined,
    clearedAt: row.cleared_at ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
