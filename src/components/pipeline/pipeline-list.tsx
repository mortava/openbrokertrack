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
  'px-3 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap bg-slate-50';

const tdClass = 'px-3 py-2.5 align-middle';

export function PipelineList({ loans }: PipelineListProps) {
  if (loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <MessageSquare size={20} className="text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600">No loans found</p>
        <p className="text-xs text-slate-400 mt-1">
          Try adjusting your filters or create a new loan.
        </p>
      </div>
    );
  }

  return (
    /* Outer wrapper handles horizontal scroll; first column is sticky */
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200">
            <th className={cn(thClass, 'sticky left-0 z-10 min-w-[140px]')}>Loan / Status</th>
            <th className={cn(thClass, 'min-w-[64px]')}>Date</th>
            <th className={cn(thClass, 'min-w-[160px]')}>Borrower</th>
            <th className={cn(thClass, 'min-w-[180px]')}>Property</th>
            <th className={cn(thClass, 'min-w-[80px]')}>Purpose</th>
            <th className={cn(thClass, 'min-w-[80px]')}>Occupancy</th>
            <th className={cn(thClass, 'min-w-[70px]')}>Type</th>
            <th className={cn(thClass, 'min-w-[64px]')}>FICO</th>
            <th className={cn(thClass, 'min-w-[100px] text-right')}>Amount</th>
            <th className={cn(thClass, 'min-w-[90px]')}>LTV / CLTV</th>
            <th className={cn(thClass, 'min-w-[60px]')}>Rate</th>
            <th className={cn(thClass, 'min-w-[100px]')}>Loan Officer</th>
            <th className={cn(thClass, 'min-w-[36px]')}></th>
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
  const rowBg = isEven ? 'bg-slate-50/50' : 'bg-white';

  return (
    <tr
      className={cn(
        rowBg,
        'border-b border-slate-100 hover:bg-blue-50/40 transition-colors group'
      )}
    >
      {/* Loan # + Status — sticky */}
      <td className={cn(tdClass, 'sticky left-0 z-10', rowBg, 'group-hover:bg-blue-50/40')}>
        <Link href={`/loans/${loan.id}`} className="block">
          <p className="font-semibold text-blue-600 hover:text-blue-700 tabular-nums text-[11px]">
            {loan.loanNumber ?? loan.id.slice(0, 8).toUpperCase()}
          </p>
          <div className="mt-0.5">
            <StageBadge stage={loan.status} size="sm" />
          </div>
        </Link>
      </td>

      {/* Date */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block text-slate-500 whitespace-nowrap">
          {formatDate(loan.createdAt)}
        </Link>
      </td>

      {/* Borrower */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block">
          <p className="font-medium text-slate-900 truncate max-w-[150px]">
            {loan.borrowerName}
          </p>
          {loan.email && (
            <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{loan.email}</p>
          )}
          {loan.phone && (
            <p className="text-[10px] text-slate-400">{formatPhone(loan.phone)}</p>
          )}
        </Link>
      </td>

      {/* Property */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block">
          <p className="text-slate-700 truncate max-w-[170px]">{loan.propertyAddress}</p>
          <p className="text-[10px] text-slate-400">
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

      {/* Occupancy */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block">
          <OccupancyBadge occupancy={loan.occupancy} />
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

      {/* Amount */}
      <td className={cn(tdClass, 'text-right')}>
        <Link href={`/loans/${loan.id}`} className="block">
          <span className="font-semibold text-slate-900 tabular-nums">
            {formatCurrency(loan.loanAmount)}
          </span>
        </Link>
      </td>

      {/* LTV / CLTV */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block tabular-nums">
          <span className="text-slate-700">{loan.ltv.toFixed(1)}%</span>
          {loan.cltv !== undefined && loan.cltv > 0 && (
            <span className="text-slate-400"> / {loan.cltv.toFixed(1)}%</span>
          )}
        </Link>
      </td>

      {/* Rate */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block">
          {loan.rate ? (
            <span className="font-medium text-slate-800 tabular-nums">
              {loan.rate.toFixed(3)}%
            </span>
          ) : (
            <span className="text-slate-300">—</span>
          )}
        </Link>
      </td>

      {/* LO */}
      <td className={tdClass}>
        <Link href={`/loans/${loan.id}`} className="block truncate max-w-[95px] text-slate-600">
          {loan.loanOfficer ?? <span className="text-slate-300">—</span>}
        </Link>
      </td>

      {/* Notes icon */}
      <td className={tdClass}>
        {loan.notes && (
          <Link href={`/loans/${loan.id}`} className="flex items-center justify-center">
            <MessageSquare size={13} className="text-slate-400" />
          </Link>
        )}
      </td>
    </tr>
  );
}

export default PipelineList;
