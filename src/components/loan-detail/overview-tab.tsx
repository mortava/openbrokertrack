'use client';

import { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import type { Loan } from '@/types';
import { updateLoan } from '@/lib/mutations';
import { formatCurrency, formatDate, formatPhone } from '@/lib/utils';

interface OverviewTabProps {
  loan: Loan;
  onRefetch: () => void;
}

// ─── Section card ─────────────────────────────────────────────────────────────

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  editMode: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}

function SectionCard({
  title,
  children,
  editMode,
  onEdit,
  onSave,
  onCancel,
  saving,
}: SectionCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{title}</h3>
        {editMode ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={onCancel}
              disabled={saving}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <X size={11} /> Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-white bg-[#171717] rounded-md hover:bg-[#171717]/90 disabled:opacity-60"
            >
              {saving ? (
                <span className="w-2.5 h-2.5 border border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Check size={11} />
              )}
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#171717] transition-colors"
          >
            <Edit2 size={11} />
            Edit
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">{children}</div>
    </div>
  );
}

// ─── Field display / edit ──────────────────────────────────────────────────────

function Field({
  label,
  value,
  editMode,
  editElement,
}: {
  label: string;
  value: string;
  editMode?: boolean;
  editElement?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      {editMode && editElement ? (
        editElement
      ) : (
        <p className="text-xs font-medium text-gray-800 truncate" title={value}>
          {value || <span className="text-gray-300">—</span>}
        </p>
      )}
    </div>
  );
}

const inputClass =
  'w-full px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]/30 bg-white';

const selectClass =
  'w-full px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]/30 bg-white';

// ─── Main component ───────────────────────────────────────────────────────────

export function OverviewTab({ loan, onRefetch }: OverviewTabProps) {
  // Each section has its own edit state
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Partial<Loan>>({});

  function startEdit(section: string) {
    setEditing(section);
    setDraft({ ...loan });
  }

  function cancelEdit() {
    setEditing(null);
    setDraft({});
  }

  async function saveEdit() {
    setSaving(true);
    await updateLoan(loan.id, draft);
    setSaving(false);
    setEditing(null);
    setDraft({});
    onRefetch();
  }

  function d(key: keyof Loan): string {
    const v = draft[key];
    if (v === undefined || v === null) return '';
    return String(v);
  }

  function setD(key: keyof Loan, value: string | number) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function inp(key: keyof Loan, type = 'text') {
    return (
      <input
        type={type}
        value={d(key)}
        onChange={(e) =>
          setD(key, type === 'number' ? Number(e.target.value) : e.target.value)
        }
        className={inputClass}
      />
    );
  }

  function sel(key: keyof Loan, options: { value: string; label: string }[]) {
    return (
      <select value={d(key)} onChange={(e) => setD(key, e.target.value)} className={selectClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  const isEdit = (s: string) => editing === s;

  return (
    <div className="space-y-4">
      {/* 1. Borrower Information */}
      <SectionCard
        title="Borrower Information"
        editMode={isEdit('borrower')}
        onEdit={() => startEdit('borrower')}
        onSave={saveEdit}
        onCancel={cancelEdit}
        saving={saving}
      >
        <Field
          label="Borrower Name"
          value={loan.borrowerName}
          editMode={isEdit('borrower')}
          editElement={inp('borrowerName')}
        />
        <Field
          label="Co-Borrower"
          value={loan.borrowerName2 ?? ''}
          editMode={isEdit('borrower')}
          editElement={inp('borrowerName2')}
        />
        <Field
          label="Email"
          value={loan.email}
          editMode={isEdit('borrower')}
          editElement={inp('email', 'email')}
        />
        <Field
          label="Phone"
          value={formatPhone(loan.phone)}
          editMode={isEdit('borrower')}
          editElement={inp('phone', 'tel')}
        />
      </SectionCard>

      {/* 2. Terms & Mortgage */}
      <SectionCard
        title="Terms & Mortgage"
        editMode={isEdit('terms')}
        onEdit={() => startEdit('terms')}
        onSave={saveEdit}
        onCancel={cancelEdit}
        saving={saving}
      >
        <Field
          label="Loan Amount"
          value={formatCurrency(loan.loanAmount)}
          editMode={isEdit('terms')}
          editElement={inp('loanAmount', 'number')}
        />
        <Field
          label="Rate"
          value={loan.rate ? `${loan.rate.toFixed(3)}%` : ''}
          editMode={isEdit('terms')}
          editElement={inp('rate', 'number')}
        />
        <Field
          label="Program"
          value={loan.program ?? ''}
          editMode={isEdit('terms')}
          editElement={inp('program')}
        />
        <Field
          label="Loan Type"
          value={loan.loanType}
          editMode={isEdit('terms')}
          editElement={sel('loanType', [
            { value: 'conventional', label: 'Conventional' },
            { value: 'fha', label: 'FHA' },
            { value: 'va', label: 'VA' },
            { value: 'nonqm', label: 'NonQM' },
            { value: 'jumbo', label: 'Jumbo' },
          ])}
        />
        <Field
          label="Doc Type"
          value={loan.docType}
          editMode={isEdit('terms')}
          editElement={sel('docType', [
            { value: 'fullDoc', label: 'Full Doc' },
            { value: 'bankStatement', label: 'Bank Statement' },
            { value: 'dscr', label: 'DSCR' },
            { value: 'assetDepletion', label: 'Asset Depletion' },
            { value: 'other', label: 'Other' },
          ])}
        />
        <Field
          label="Purpose"
          value={loan.loanPurpose}
          editMode={isEdit('terms')}
          editElement={sel('loanPurpose', [
            { value: 'purchase', label: 'Purchase' },
            { value: 'refinance', label: 'Refinance' },
            { value: 'cashout', label: 'Cash-Out' },
          ])}
        />
        <Field
          label="Occupancy"
          value={loan.occupancy}
          editMode={isEdit('terms')}
          editElement={sel('occupancy', [
            { value: 'primary', label: 'Primary' },
            { value: 'secondary', label: 'Secondary' },
            { value: 'investment', label: 'Investment' },
          ])}
        />
      </SectionCard>

      {/* 3. Subject Property */}
      <SectionCard
        title="Subject Property"
        editMode={isEdit('property')}
        onEdit={() => startEdit('property')}
        onSave={saveEdit}
        onCancel={cancelEdit}
        saving={saving}
      >
        <Field
          label="Address"
          value={loan.propertyAddress}
          editMode={isEdit('property')}
          editElement={inp('propertyAddress')}
        />
        <Field
          label="City"
          value={loan.propertyCity}
          editMode={isEdit('property')}
          editElement={inp('propertyCity')}
        />
        <Field
          label="State"
          value={loan.propertyState}
          editMode={isEdit('property')}
          editElement={inp('propertyState')}
        />
        <Field
          label="ZIP"
          value={loan.propertyZip}
          editMode={isEdit('property')}
          editElement={inp('propertyZip')}
        />
        <Field
          label="County"
          value={loan.county ?? ''}
          editMode={isEdit('property')}
          editElement={inp('county')}
        />
        <Field
          label="Property Type"
          value={loan.propertyType}
          editMode={isEdit('property')}
          editElement={sel('propertyType', [
            { value: 'sfr', label: 'SFR' },
            { value: 'condo', label: 'Condo' },
            { value: 'townhouse', label: 'Townhouse' },
            { value: '2-4unit', label: '2–4 Unit' },
            { value: '5+unit', label: '5+ Unit' },
          ])}
        />
        <Field
          label="Appraised Value"
          value={loan.appraisalValue ? formatCurrency(loan.appraisalValue) : ''}
          editMode={isEdit('property')}
          editElement={inp('appraisalValue', 'number')}
        />
        <Field
          label="Property Value"
          value={formatCurrency(loan.propertyValue)}
          editMode={isEdit('property')}
          editElement={inp('propertyValue', 'number')}
        />
      </SectionCard>

      {/* 4. Financial Details */}
      <SectionCard
        title="Financial Details"
        editMode={isEdit('financial')}
        onEdit={() => startEdit('financial')}
        onSave={saveEdit}
        onCancel={cancelEdit}
        saving={saving}
      >
        <Field label="LTV" value={`${loan.ltv.toFixed(1)}%`} editMode={isEdit('financial')} editElement={inp('ltv', 'number')} />
        <Field label="CLTV" value={loan.cltv ? `${loan.cltv.toFixed(1)}%` : ''} editMode={isEdit('financial')} editElement={inp('cltv', 'number')} />
        <Field label="DTI" value={loan.dti ? `${loan.dti.toFixed(1)}%` : ''} editMode={isEdit('financial')} editElement={inp('dti', 'number')} />
        <Field label="Credit Score" value={String(loan.creditScore)} editMode={isEdit('financial')} editElement={inp('creditScore', 'number')} />
        <Field label="Monthly Income" value={loan.monthlyIncome ? formatCurrency(loan.monthlyIncome) : ''} editMode={isEdit('financial')} editElement={inp('monthlyIncome', 'number')} />
        <Field label="Housing Expense" value={loan.housingExpense ? formatCurrency(loan.housingExpense) : ''} editMode={isEdit('financial')} editElement={inp('housingExpense', 'number')} />
      </SectionCard>

      {/* 5. Transaction Details */}
      <SectionCard
        title="Transaction Details"
        editMode={isEdit('transaction')}
        onEdit={() => startEdit('transaction')}
        onSave={saveEdit}
        onCancel={cancelEdit}
        saving={saving}
      >
        <Field label="Down Payment" value={loan.downPayment ? formatCurrency(loan.downPayment) : ''} editMode={isEdit('transaction')} editElement={inp('downPayment', 'number')} />
        <Field label="Seller Credit" value={loan.sellerCredit ? formatCurrency(loan.sellerCredit) : ''} editMode={isEdit('transaction')} editElement={inp('sellerCredit', 'number')} />
        <Field label="Lender Credit" value={loan.lenderCredit ? formatCurrency(loan.lenderCredit) : ''} editMode={isEdit('transaction')} editElement={inp('lenderCredit', 'number')} />
        <Field label="Est. Closing Costs" value={loan.estimatedClosingCosts ? formatCurrency(loan.estimatedClosingCosts) : ''} editMode={isEdit('transaction')} editElement={inp('estimatedClosingCosts', 'number')} />
      </SectionCard>

      {/* 6. Assignments */}
      <SectionCard
        title="Assignments"
        editMode={isEdit('assignments')}
        onEdit={() => startEdit('assignments')}
        onSave={saveEdit}
        onCancel={cancelEdit}
        saving={saving}
      >
        <Field label="Loan Officer" value={loan.loanOfficer ?? ''} editMode={isEdit('assignments')} editElement={inp('loanOfficer')} />
        <Field label="Processor" value={loan.processor ?? ''} editMode={isEdit('assignments')} editElement={inp('processor')} />
        <Field label="Assigned To" value={loan.assignedTo} editMode={isEdit('assignments')} editElement={inp('assignedTo')} />
      </SectionCard>

      {/* 7. Key Dates */}
      <SectionCard
        title="Key Dates"
        editMode={isEdit('dates')}
        onEdit={() => startEdit('dates')}
        onSave={saveEdit}
        onCancel={cancelEdit}
        saving={saving}
      >
        <Field label="Created" value={formatDate(loan.createdAt)} />
        <Field
          label="Closing Date"
          value={loan.closingDate ? formatDate(loan.closingDate) : ''}
          editMode={isEdit('dates')}
          editElement={inp('closingDate', 'date')}
        />
        <Field
          label="Funding Date"
          value={loan.fundingDate ? formatDate(loan.fundingDate) : ''}
          editMode={isEdit('dates')}
          editElement={inp('fundingDate', 'date')}
        />
        <Field
          label="Lock Date"
          value={loan.lockDate ? formatDate(loan.lockDate) : ''}
          editMode={isEdit('dates')}
          editElement={inp('lockDate', 'date')}
        />
        <Field
          label="Lock Expiry"
          value={loan.lockExpiry ? formatDate(loan.lockExpiry) : ''}
          editMode={isEdit('dates')}
          editElement={inp('lockExpiry', 'date')}
        />
        <Field
          label="Lock Days"
          value={loan.lockDays ? String(loan.lockDays) : ''}
          editMode={isEdit('dates')}
          editElement={inp('lockDays', 'number')}
        />
      </SectionCard>
    </div>
  );
}

export default OverviewTab;
