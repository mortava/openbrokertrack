import { supabase, dbToLoan, dbToContact, dbToTask, dbToNote, dbToActivity } from './supabase';
import type { Loan, Contact, Task, LoanNote, LoanActivity, PipelineStage } from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

type MutationResult<T> = { data: T | null; error: string | null };

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message: unknown }).message);
  }
  return 'An unknown error occurred';
}

// ─── Loans ───────────────────────────────────────────────────────────────────

export async function createLoan(
  data: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MutationResult<Loan>> {
  try {
    const { data: row, error } = await supabase
      .from('loans')
      .insert({
        loan_number: data.loanNumber ?? null,
        borrower_name: data.borrowerName,
        borrower_name2: data.borrowerName2 ?? null,
        email: data.email,
        phone: data.phone,
        property_address: data.propertyAddress,
        property_city: data.propertyCity,
        property_state: data.propertyState,
        property_zip: data.propertyZip,
        county: data.county ?? null,
        property_type: data.propertyType,
        property_value: data.propertyValue,
        appraisal_value: data.appraisalValue ?? null,
        loan_amount: data.loanAmount,
        loan_purpose: data.loanPurpose,
        occupancy: data.occupancy,
        loan_type: data.loanType,
        doc_type: data.docType,
        program: data.program ?? null,
        credit_score: data.creditScore,
        ltv: data.ltv,
        cltv: data.cltv ?? null,
        dti: data.dti ?? null,
        monthly_income: data.monthlyIncome ?? null,
        housing_expense: data.housingExpense ?? null,
        down_payment: data.downPayment ?? null,
        seller_credit: data.sellerCredit ?? null,
        lender_credit: data.lenderCredit ?? null,
        estimated_closing_costs: data.estimatedClosingCosts ?? null,
        rate: data.rate ?? null,
        lock_date: data.lockDate ?? null,
        lock_days: data.lockDays ?? null,
        lock_expiry: data.lockExpiry ?? null,
        loan_officer: data.loanOfficer ?? null,
        processor: data.processor ?? null,
        assigned_to: data.assignedTo,
        status: data.status,
        closing_date: data.closingDate ?? null,
        funding_date: data.fundingDate ?? null,
        notes: data.notes ?? null,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: dbToLoan(row), error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

export async function updateLoan(
  id: string,
  data: Partial<Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<MutationResult<Loan>> {
  try {
    const patch: Record<string, unknown> = {};

    if (data.loanNumber !== undefined) patch.loan_number = data.loanNumber;
    if (data.borrowerName !== undefined) patch.borrower_name = data.borrowerName;
    if (data.borrowerName2 !== undefined) patch.borrower_name2 = data.borrowerName2;
    if (data.email !== undefined) patch.email = data.email;
    if (data.phone !== undefined) patch.phone = data.phone;
    if (data.propertyAddress !== undefined) patch.property_address = data.propertyAddress;
    if (data.propertyCity !== undefined) patch.property_city = data.propertyCity;
    if (data.propertyState !== undefined) patch.property_state = data.propertyState;
    if (data.propertyZip !== undefined) patch.property_zip = data.propertyZip;
    if (data.county !== undefined) patch.county = data.county;
    if (data.propertyType !== undefined) patch.property_type = data.propertyType;
    if (data.propertyValue !== undefined) patch.property_value = data.propertyValue;
    if (data.appraisalValue !== undefined) patch.appraisal_value = data.appraisalValue;
    if (data.loanAmount !== undefined) patch.loan_amount = data.loanAmount;
    if (data.loanPurpose !== undefined) patch.loan_purpose = data.loanPurpose;
    if (data.occupancy !== undefined) patch.occupancy = data.occupancy;
    if (data.loanType !== undefined) patch.loan_type = data.loanType;
    if (data.docType !== undefined) patch.doc_type = data.docType;
    if (data.program !== undefined) patch.program = data.program;
    if (data.creditScore !== undefined) patch.credit_score = data.creditScore;
    if (data.ltv !== undefined) patch.ltv = data.ltv;
    if (data.cltv !== undefined) patch.cltv = data.cltv;
    if (data.dti !== undefined) patch.dti = data.dti;
    if (data.monthlyIncome !== undefined) patch.monthly_income = data.monthlyIncome;
    if (data.housingExpense !== undefined) patch.housing_expense = data.housingExpense;
    if (data.downPayment !== undefined) patch.down_payment = data.downPayment;
    if (data.sellerCredit !== undefined) patch.seller_credit = data.sellerCredit;
    if (data.lenderCredit !== undefined) patch.lender_credit = data.lenderCredit;
    if (data.estimatedClosingCosts !== undefined) patch.estimated_closing_costs = data.estimatedClosingCosts;
    if (data.rate !== undefined) patch.rate = data.rate;
    if (data.lockDate !== undefined) patch.lock_date = data.lockDate;
    if (data.lockDays !== undefined) patch.lock_days = data.lockDays;
    if (data.lockExpiry !== undefined) patch.lock_expiry = data.lockExpiry;
    if (data.loanOfficer !== undefined) patch.loan_officer = data.loanOfficer;
    if (data.processor !== undefined) patch.processor = data.processor;
    if (data.assignedTo !== undefined) patch.assigned_to = data.assignedTo;
    if (data.status !== undefined) patch.status = data.status;
    if (data.closingDate !== undefined) patch.closing_date = data.closingDate;
    if (data.fundingDate !== undefined) patch.funding_date = data.fundingDate;
    if (data.notes !== undefined) patch.notes = data.notes;

    patch.updated_at = new Date().toISOString();

    const { data: row, error } = await supabase
      .from('loans')
      .update(patch)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: dbToLoan(row), error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

export async function deleteLoan(id: string): Promise<MutationResult<null>> {
  try {
    const { error } = await supabase.from('loans').delete().eq('id', id);
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

export async function updateLoanStatus(
  id: string,
  newStatus: PipelineStage,
  performedBy = 'System'
): Promise<MutationResult<Loan>> {
  try {
    // Update the loan status
    const { data: row, error: updateError } = await supabase
      .from('loans')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (updateError) return { data: null, error: updateError.message };

    // Log activity — fire and forget, don't fail the mutation on log error
    await supabase.from('loan_activities').insert({
      loan_id: id,
      action: 'status_change',
      description: `Status changed to "${newStatus}"`,
      performed_by: performedBy,
      metadata: { newStatus },
    });

    return { data: dbToLoan(row), error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export async function createContact(
  data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MutationResult<Contact>> {
  try {
    const { data: row, error } = await supabase
      .from('contacts')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company ?? null,
        type: data.type,
        loans: data.loans ?? [],
        address: data.address ?? null,
        city: data.city ?? null,
        state: data.state ?? null,
        zip: data.zip ?? null,
        license_number: data.licenseNumber ?? null,
        notes: data.notes ?? null,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: dbToContact(row), error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

export async function updateContact(
  id: string,
  data: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<MutationResult<Contact>> {
  try {
    const patch: Record<string, unknown> = {};

    if (data.name !== undefined) patch.name = data.name;
    if (data.email !== undefined) patch.email = data.email;
    if (data.phone !== undefined) patch.phone = data.phone;
    if (data.company !== undefined) patch.company = data.company;
    if (data.type !== undefined) patch.type = data.type;
    if (data.loans !== undefined) patch.loans = data.loans;
    if (data.address !== undefined) patch.address = data.address;
    if (data.city !== undefined) patch.city = data.city;
    if (data.state !== undefined) patch.state = data.state;
    if (data.zip !== undefined) patch.zip = data.zip;
    if (data.licenseNumber !== undefined) patch.license_number = data.licenseNumber;
    if (data.notes !== undefined) patch.notes = data.notes;

    patch.updated_at = new Date().toISOString();

    const { data: row, error } = await supabase
      .from('contacts')
      .update(patch)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: dbToContact(row), error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

export async function deleteContact(id: string): Promise<MutationResult<null>> {
  try {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export async function createTask(
  data: Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>
): Promise<MutationResult<Task>> {
  try {
    const { data: row, error } = await supabase
      .from('tasks')
      .insert({
        loan_id: data.loanId || null,
        title: data.title,
        description: data.description ?? null,
        due_date: data.dueDate ?? null,
        completed: false,
        completed_at: null,
        assigned_to: data.assignedTo ?? null,
        priority: data.priority,
        category: data.category,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: dbToTask(row), error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

export async function completeTask(id: string): Promise<MutationResult<Task>> {
  try {
    const { data: row, error } = await supabase
      .from('tasks')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: dbToTask(row), error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

export async function updateTask(
  id: string,
  data: Partial<Omit<Task, 'id' | 'loanId' | 'createdAt' | 'updatedAt'>>
): Promise<MutationResult<Task>> {
  try {
    const patch: Record<string, unknown> = {};

    if (data.title !== undefined) patch.title = data.title;
    if (data.description !== undefined) patch.description = data.description;
    if (data.dueDate !== undefined) patch.due_date = data.dueDate;
    if (data.completed !== undefined) patch.completed = data.completed;
    if (data.completedAt !== undefined) patch.completed_at = data.completedAt;
    if (data.assignedTo !== undefined) patch.assigned_to = data.assignedTo;
    if (data.priority !== undefined) patch.priority = data.priority;
    if (data.category !== undefined) patch.category = data.category;

    patch.updated_at = new Date().toISOString();

    const { data: row, error } = await supabase
      .from('tasks')
      .update(patch)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: dbToTask(row), error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

export async function deleteTask(id: string): Promise<MutationResult<null>> {
  try {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

// ─── Notes ───────────────────────────────────────────────────────────────────

export async function addNote(
  loanId: string,
  content: string,
  author: string
): Promise<MutationResult<LoanNote>> {
  try {
    const { data: row, error } = await supabase
      .from('loan_notes')
      .insert({ loan_id: loanId, content, author, pinned: false })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: dbToNote(row), error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

export async function deleteNote(id: string): Promise<MutationResult<null>> {
  try {
    const { error } = await supabase.from('loan_notes').delete().eq('id', id);
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

// ─── Activity ────────────────────────────────────────────────────────────────

export async function addActivity(
  loanId: string,
  action: string,
  description: string,
  performedBy: string,
  metadata?: Record<string, unknown>
): Promise<MutationResult<LoanActivity>> {
  try {
    const { data: row, error } = await supabase
      .from('loan_activities')
      .insert({
        loan_id: loanId,
        action,
        description,
        performed_by: performedBy,
        metadata: metadata ?? null,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: dbToActivity(row), error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}
