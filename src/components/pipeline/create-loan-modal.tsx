'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormField } from '@/components/ui/form-field';
import { createLoan } from '@/lib/mutations';
import type { Loan } from '@/types';

interface CreateLoanModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  // Borrower
  borrowerName: string;
  borrowerName2: string;
  email: string;
  phone: string;

  // Property
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
  county: string;
  propertyType: Loan['propertyType'];

  // Loan Details
  loanAmount: string;
  propertyValue: string;
  loanPurpose: Loan['loanPurpose'];
  occupancy: Loan['occupancy'];
  loanType: Loan['loanType'];
  docType: Loan['docType'];
  creditScore: string;
  program: string;

  // Assignment
  loanOfficer: string;
  processor: string;
}

const initial: FormState = {
  borrowerName: '',
  borrowerName2: '',
  email: '',
  phone: '',
  propertyAddress: '',
  propertyCity: '',
  propertyState: '',
  propertyZip: '',
  county: '',
  propertyType: 'sfr',
  loanAmount: '',
  propertyValue: '',
  loanPurpose: 'purchase',
  occupancy: 'primary',
  loanType: 'conventional',
  docType: 'fullDoc',
  creditScore: '',
  program: '',
  loanOfficer: '',
  processor: '',
};

const inputClass =
  'w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]/30 bg-white placeholder:text-gray-400';

const selectClass =
  'w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]/30 bg-white text-gray-700';

export function CreateLoanModal({ open, onClose, onSuccess }: CreateLoanModalProps) {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.borrowerName.trim()) next.borrowerName = 'Required';
    if (!form.email.trim()) next.email = 'Required';
    if (!form.loanAmount.trim() || isNaN(Number(form.loanAmount))) {
      next.loanAmount = 'Valid amount required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError(null);

    const loanAmount = Number(form.loanAmount);
    const propertyValue = form.propertyValue ? Number(form.propertyValue) : loanAmount;
    const creditScore = form.creditScore ? Number(form.creditScore) : 680;
    const ltv = propertyValue > 0 ? Math.round((loanAmount / propertyValue) * 1000) / 10 : 0;

    const { error } = await createLoan({
      borrowerName: form.borrowerName.trim(),
      borrowerName2: form.borrowerName2.trim() || undefined,
      email: form.email.trim(),
      phone: form.phone.trim(),
      propertyAddress: form.propertyAddress.trim() || '',
      propertyCity: form.propertyCity.trim() || '',
      propertyState: form.propertyState.trim() || '',
      propertyZip: form.propertyZip.trim() || '',
      county: form.county.trim() || undefined,
      propertyType: form.propertyType,
      propertyValue,
      loanAmount,
      loanPurpose: form.loanPurpose,
      occupancy: form.occupancy,
      loanType: form.loanType,
      docType: form.docType,
      creditScore,
      ltv,
      program: form.program.trim() || undefined,
      loanOfficer: form.loanOfficer.trim() || undefined,
      processor: form.processor.trim() || undefined,
      assignedTo: form.loanOfficer.trim() || 'Unassigned',
      status: 'lead',
    });

    setSubmitting(false);

    if (error) {
      setServerError(error);
      return;
    }

    setForm(initial);
    setErrors({});
    onSuccess();
    onClose();
  }

  function handleClose() {
    setForm(initial);
    setErrors({});
    setServerError(null);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Create New Loan" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {serverError && (
          <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
            {serverError}
          </div>
        )}

        {/* Section 1: Borrower Info */}
        <div>
          <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Borrower Information
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Borrower Name" required error={errors.borrowerName} className="col-span-2 sm:col-span-1">
              <input type="text" placeholder="John Smith" value={form.borrowerName} onChange={(e) => set('borrowerName', e.target.value)} className={inputClass} />
            </FormField>
            <FormField label="Co-Borrower Name" className="col-span-2 sm:col-span-1">
              <input type="text" placeholder="Jane Smith (optional)" value={form.borrowerName2} onChange={(e) => set('borrowerName2', e.target.value)} className={inputClass} />
            </FormField>
            <FormField label="Email" required error={errors.email}>
              <input type="email" placeholder="borrower@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
            </FormField>
            <FormField label="Phone">
              <input type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} />
            </FormField>
          </div>
        </div>

        {/* Section 2: Property */}
        <div>
          <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Property
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Street Address" className="col-span-2">
              <input type="text" placeholder="123 Main St" value={form.propertyAddress} onChange={(e) => set('propertyAddress', e.target.value)} className={inputClass} />
            </FormField>
            <FormField label="City">
              <input type="text" placeholder="Los Angeles" value={form.propertyCity} onChange={(e) => set('propertyCity', e.target.value)} className={inputClass} />
            </FormField>
            <div className="grid grid-cols-2 gap-2">
              <FormField label="State">
                <input type="text" placeholder="CA" maxLength={2} value={form.propertyState} onChange={(e) => set('propertyState', e.target.value.toUpperCase())} className={inputClass} />
              </FormField>
              <FormField label="ZIP">
                <input type="text" placeholder="90001" value={form.propertyZip} onChange={(e) => set('propertyZip', e.target.value)} className={inputClass} />
              </FormField>
            </div>
            <FormField label="County">
              <input type="text" placeholder="Los Angeles County" value={form.county} onChange={(e) => set('county', e.target.value)} className={inputClass} />
            </FormField>
            <FormField label="Property Type">
              <select value={form.propertyType} onChange={(e) => set('propertyType', e.target.value)} className={selectClass}>
                <option value="sfr">Single Family (SFR)</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="2-4unit">2–4 Unit</option>
                <option value="5+unit">5+ Unit</option>
              </select>
            </FormField>
          </div>
        </div>

        {/* Section 3: Loan Details */}
        <div>
          <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Loan Details
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Loan Amount" required error={errors.loanAmount}>
              <input type="number" placeholder="500000" value={form.loanAmount} onChange={(e) => set('loanAmount', e.target.value)} className={inputClass} />
            </FormField>
            <FormField label="Property / Appraised Value">
              <input type="number" placeholder="625000" value={form.propertyValue} onChange={(e) => set('propertyValue', e.target.value)} className={inputClass} />
            </FormField>
            <FormField label="Loan Purpose">
              <select value={form.loanPurpose} onChange={(e) => set('loanPurpose', e.target.value)} className={selectClass}>
                <option value="purchase">Purchase</option>
                <option value="refinance">Refinance</option>
                <option value="cashout">Cash-Out Refinance</option>
              </select>
            </FormField>
            <FormField label="Occupancy">
              <select value={form.occupancy} onChange={(e) => set('occupancy', e.target.value)} className={selectClass}>
                <option value="primary">Primary Residence</option>
                <option value="secondary">Secondary Home</option>
                <option value="investment">Investment Property</option>
              </select>
            </FormField>
            <FormField label="Loan Type">
              <select value={form.loanType} onChange={(e) => set('loanType', e.target.value)} className={selectClass}>
                <option value="conventional">Conventional</option>
                <option value="fha">FHA</option>
                <option value="va">VA</option>
                <option value="nonqm">NonQM</option>
                <option value="jumbo">Jumbo</option>
              </select>
            </FormField>
            <FormField label="Documentation Type">
              <select value={form.docType} onChange={(e) => set('docType', e.target.value)} className={selectClass}>
                <option value="fullDoc">Full Doc</option>
                <option value="bankStatement">Bank Statement</option>
                <option value="dscr">DSCR</option>
                <option value="assetDepletion">Asset Depletion</option>
                <option value="other">Other</option>
              </select>
            </FormField>
            <FormField label="Credit Score" error={errors.creditScore}>
              <input type="number" placeholder="740" min={300} max={850} value={form.creditScore} onChange={(e) => set('creditScore', e.target.value)} className={inputClass} />
            </FormField>
            <FormField label="Program">
              <input type="text" placeholder="e.g. 30YR Fixed" value={form.program} onChange={(e) => set('program', e.target.value)} className={inputClass} />
            </FormField>
          </div>
        </div>

        {/* Section 4: Assignment */}
        <div>
          <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Assignment
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Loan Officer">
              <input type="text" placeholder="Jane Doe" value={form.loanOfficer} onChange={(e) => set('loanOfficer', e.target.value)} className={inputClass} />
            </FormField>
            <FormField label="Processor">
              <input type="text" placeholder="Bob Smith" value={form.processor} onChange={(e) => set('processor', e.target.value)} className={inputClass} />
            </FormField>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="px-4 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-1.5 text-xs font-medium text-white bg-[#171717] rounded-md hover:bg-[#171717]/90 transition-colors disabled:opacity-60 flex items-center gap-1.5"
          >
            {submitting && (
              <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {submitting ? 'Creating...' : 'Create Loan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateLoanModal;
