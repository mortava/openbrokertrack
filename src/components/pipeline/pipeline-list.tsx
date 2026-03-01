'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import type { Loan } from '@/types';
import {
  StageBadge,
  PurposeBadge,
  OccupancyBadge,
  LoanTypeBadge,
  CreditScoreBadge,
} from '@/components/ui/badge';
import { formatCurrency, formatDate, formatPhone, cn } from '@/lib/utils';

interface PipelineListProps {
  loans: Loan[];
}

const thClass =
  'px-1.5 py-2 text-left text-[9px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50';

const tdClass = 'px-1.5 py-2 align-middle overflow-hidden';

/** Format a date as MM/DD/YY */
function shortDate(value: string | Date | undefined | null): string {
  if (!value) return '—';
  const d = new Date(value as string);
  if (isNaN(d.getTime())) return '—';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(2);
  return `${mm}/${dd}/${yy}`;
}

export function PipelineList({ loans }: PipelineListProps) {
  if (loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <MessageSquare size={20} className="text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-600">No loans found</p>
        <p className="text-xs text-gray-400 mt-1">
          Try adjusting your filters or create a new loan.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full table-fixed border-collapse text-xs">
        <colgroup>
          <col className="w-[9%]" />   {/* Loan */}
          <col className="w-[6%]" />   {/* Date */}
          <col className="w-[13%]" />  {/* Borrower */}
          <col className="w-[17%]" />  {/* Property */}
          <col className="w-[6%]" />   {/* Purpose */}
          <col className="w-[5%]" />   {/* Type */}
          <col className="w-[5%]" />   {/* FICO */}
          <col className="w-[10%]" />  {/* Amount */}
          <col className="w-[6%]" />   {/* LTV */}
          <col className="w-[5%]" />   {/* Rate */}
          <col className="w-[18%]" />  {/* Loan Officer — remaining ~100% */}
        </colgroup>
        <thead>
          <tr className="border-b border-gray-200">
            <th className={thClass}>Loan</th>
            <th className={thClass}>Date</th>
            <th className={thClass}>Borrower</th>
            <th className={thClass}>Property</th>
            <th className={thClass}>Purpose</th>
            <th className={thClass}>Type</th>
            <th className={thClass}>FICO</th>
            <th className={cn(thClass, 'text-right')}>Amount</th>
            <th className={thClass}>LTV</th>
            <th className={thClass}>Rate</th>
            <th className={thClass}>Loan Officer</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan, i) => (
            <LoanRow key={loan.id} loan={loan} isEven={i % 2 === 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LoanRow({ loan, isEven }: { loan: Loan; isEven: boolean }) {
  const rowBg = isEven ? 'bg-gray-50/30' : 'bg-white';

  return (
    <tr
      className={cn(
        rowBg,
        'border-b border-gray-100 hover:bg-gray-50 transition-colors'
      )}
    >
      {/* Loan # + Stage stacked */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block">
          <p className="font-semibold text-[#171717] hover:text-[#171717]/70 tabular-nums text-[11px] truncate">
            {loan.loanNumber ?? loan.id.slice(0, 8).toUpperCase()}
          </p>
          <div className="mt-0.5">
            <StageBadge stage={loan.status} size="sm" />
          </div>
        </Link>
      </td>

      {/* Date — MM/DD/YY */}
      <td className={tdClass}>
        <Link
          href={`/loans/${loan.id}`}
          className="block text-gray-500 whitespace-nowrap truncate"
        >
          {shortDate(loan.createdAt)}
        </Link>
      </td>

      {/* Borrower — name only, truncated */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block">
          <p className="font-medium text-gray-900 truncate">{loan.borrowerName}</p>
        </Link>
      </td>

      {/* Property — address line 1, city/st zip stacked */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block">
          <p className="text-gray-700 truncate">{loan.propertyAddress}</p>
          <p className="text-[10px] text-gray-400 truncate">
            {loan.propertyCity}, {loan.propertyState} {loan.propertyZip}
          </p>
        </Link>
      </td>

      {/* Purpose */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block">
          <PurposeBadge purpose={loan.loanPurpose} />
        </Link>
      </td>

      {/* Loan Type */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block">
          <LoanTypeBadge loanType={loan.loanType} />
        </Link>
      </td>

      {/* FICO */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block">
          <CreditScoreBadge score={loan.creditScore} />
        </Link>
      </td>

      {/* Amount — right-aligned */}
      <td className={cn(tdClass, 'text-right')}>
        <Link href={`/loans/${loan.id}`} className="block">
          <span className="font-semibold text-gray-900 tabular-nums">
            {formatCurrency(loan.loanAmount)}
          </span>
        </Link>
      </td>

      {/* LTV / optional CLTV */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block tabular-nums truncate">
          <span className="text-gray-700">{loan.ltv.toFixed(1)}%</span>
          {loan.cltv !== undefined && loan.cltv > 0 && (
            <span className="text-gray-400">/{loan.cltv.toFixed(1)}%</span>
          )}
        </Link>
      </td>

      {/* Rate */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block">
          {loan.rate ? (
            <span className="font-medium text-gray-800 tabular-nums">
              {loan.rate.toFixed(3)}%
            </span>
          ) : (
            <span className="text-gray-300">—</span>
          )}
        </Link>
      </td>

      {/* Loan Officer */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block truncate text-gray-600">
          {loan.loanOfficer ?? <span className="text-gray-300">—</span>}
        </Link>
      </td>
    </tr>
  );
}

export default PipelineList;
