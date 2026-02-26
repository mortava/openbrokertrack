'use client';

import { Loan } from '@/types';
import { StageBadge } from '@/components/ui/badge';
import { formatCurrency, daysAgo } from '@/lib/utils';

interface RecentActivityProps {
  loans: Loan[];
}

export default function RecentActivity({ loans }: RecentActivityProps) {
  const sorted = [...loans]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {sorted.map((loan) => (
          <div
            key={loan.id}
            className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                {loan.borrowerName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {loan.borrowerName}
                </p>
                <p className="text-xs text-slate-400">
                  {loan.id} &middot; {formatCurrency(loan.loanAmount)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <StageBadge stage={loan.status} />
              <span className="text-xs text-slate-400 w-16 text-right">
                {daysAgo(loan.updatedAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
