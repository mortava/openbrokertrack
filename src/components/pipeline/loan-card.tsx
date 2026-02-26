'use client';

import { Loan } from '@/types';
import { formatCurrency, daysAgo, getInitials } from '@/lib/utils';
import { TypeBadge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';

interface LoanCardProps {
  loan: Loan;
}

const loanTypeVariant: Record<string, 'default' | 'blue' | 'purple' | 'amber' | 'green'> = {
  conventional: 'blue',
  fha: 'green',
  va: 'purple',
  nonqm: 'amber',
  jumbo: 'purple',
};

export default function LoanCard({ loan }: LoanCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 hover:shadow-md transition-shadow cursor-pointer group">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
            {loan.borrowerName}
          </p>
          <p className="text-xs text-slate-400">{loan.id}</p>
        </div>
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 shrink-0 ml-2">
          {getInitials(loan.assignedTo)}
        </div>
      </div>

      {/* Amount */}
      <p className="text-base font-bold text-slate-900 mb-2">
        {formatCurrency(loan.loanAmount)}
      </p>

      {/* Details */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin size={12} className="text-slate-400" />
          <span className="truncate">
            {loan.propertyCity}, {loan.propertyState}
          </span>
        </div>
        {loan.rate && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-slate-400 font-medium">%</span>
            <span>{loan.rate}% rate</span>
            {loan.lockExpiry && (
              <span className="text-slate-400">
                &middot; Lock {daysAgo(loan.lockExpiry) === 'Today' ? 'expires today' : loan.lockExpiry}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <TypeBadge variant={loanTypeVariant[loan.loanType] || 'default'}>
          {loan.loanType.toUpperCase()}
        </TypeBadge>
        <TypeBadge>
          {loan.loanPurpose === 'cashout' ? 'Cash-Out' : loan.loanPurpose.charAt(0).toUpperCase() + loan.loanPurpose.slice(1)}
        </TypeBadge>
        <TypeBadge>LTV {loan.ltv}%</TypeBadge>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Calendar size={10} />
          {daysAgo(loan.updatedAt)}
        </span>
        <span className="text-[10px] text-slate-400">
          FICO {loan.creditScore}
        </span>
      </div>
    </div>
  );
}
