'use client';

import { Loan } from '@/types';
import { formatCurrency, daysAgo, getInitials } from '@/lib/utils';
import { TypeBadge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

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
    <div className="bg-white rounded-md border border-gray-200 p-2.5 hover:border-gray-300 transition-colors cursor-pointer group">
      {/* Header */}
      <div className="flex items-start justify-between mb-1.5">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate group-hover:text-[#171717] transition-colors">
            {loan.borrowerName}
          </p>
          <p className="text-[10px] text-gray-400">{loan.id}</p>
        </div>
        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-700 shrink-0 ml-1">
          {getInitials(loan.assignedTo)}
        </div>
      </div>

      {/* Amount */}
      <p className="text-sm font-bold text-gray-900 mb-1.5">
        {formatCurrency(loan.loanAmount)}
      </p>

      {/* Location */}
      <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
        <MapPin size={10} className="text-gray-400 shrink-0" />
        <span className="truncate">
          {loan.propertyCity}, {loan.propertyState}
        </span>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-1 flex-wrap">
        <TypeBadge variant={loanTypeVariant[loan.loanType] || 'default'}>
          {loan.loanType.toUpperCase()}
        </TypeBadge>
        <TypeBadge>LTV {loan.ltv}%</TypeBadge>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-100">
        <span className="text-[9px] text-gray-400">{daysAgo(loan.updatedAt)}</span>
        <span className="text-[9px] text-gray-400">FICO {loan.creditScore}</span>
      </div>
    </div>
  );
}
