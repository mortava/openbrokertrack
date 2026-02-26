import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types matching our database schema
export interface DbLoan {
  id: string;
  borrower_name: string;
  email: string;
  phone: string;
  loan_amount: number;
  property_value: number;
  property_address: string;
  property_city: string;
  property_state: string;
  property_zip: string;
  property_type: string;
  loan_purpose: string;
  occupancy: string;
  status: string;
  credit_score: number;
  ltv: number;
  loan_type: string;
  doc_type: string;
  rate: number | null;
  lock_expiry: string | null;
  assigned_to: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  type: string;
  loans: string[];
  created_at: string;
}

// Convert DB row to app Loan type
export function dbToLoan(row: DbLoan) {
  return {
    id: row.id,
    borrowerName: row.borrower_name,
    email: row.email,
    phone: row.phone,
    loanAmount: Number(row.loan_amount),
    propertyValue: Number(row.property_value),
    propertyAddress: row.property_address,
    propertyCity: row.property_city,
    propertyState: row.property_state,
    propertyZip: row.property_zip,
    propertyType: row.property_type as any,
    loanPurpose: row.loan_purpose as any,
    occupancy: row.occupancy as any,
    status: row.status as any,
    creditScore: row.credit_score,
    ltv: Number(row.ltv),
    loanType: row.loan_type as any,
    docType: row.doc_type as any,
    rate: row.rate ? Number(row.rate) : undefined,
    lockExpiry: row.lock_expiry ?? undefined,
    assignedTo: row.assigned_to,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Convert DB row to app Contact type
export function dbToContact(row: DbContact) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company ?? undefined,
    type: row.type as any,
    loans: row.loans,
    createdAt: row.created_at,
  };
}
