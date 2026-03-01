'use client';

import Link from 'next/link';
import { useLoans } from '@/hooks/useLoans';
import { StageBadge } from '@/components/ui/badge';
import { formatCurrency, daysAgo } from '@/lib/utils';

export default function LastModifiedLoans() {
  const { loans, loading } = useLoans();

  const sorted = [...loans]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10);

  const loanTypeLabel: Record<string, string> = {
    conventional: 'Conv',
    fha: 'FHA',
    va: 'VA',
    nonqm: 'NonQM',
    jumbo: 'Jumbo',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
        <h3 className="text-sm font-semibold text-gray-900">Last Modified Loans</h3>
        <Link
          href="/pipeline"
          className="text-[11px] text-[#171717] hover:text-[#171717]/70 font-medium"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <div className="p-4 space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-7 h-7 rounded-full bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-gray-100 rounded w-32" />
                <div className="h-2.5 bg-gray-100 rounded w-20" />
              </div>
              <div className="h-4 bg-gray-100 rounded w-16" />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <p className="text-sm">No loans yet</p>
          <Link href="/loans/new" className="mt-2 text-xs text-[#171717] hover:text-[#171717]/70 font-medium">
            Create your first loan
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {sorted.map((loan) => (
            <Link
              key={loan.id}
              href={`/loans/${loan.id}`}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
            >
              {/* Name + type */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate group-hover:text-[#171717] transition-colors">
                  {loan.borrowerName}
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  {loanTypeLabel[loan.loanType] ?? loan.loanType} &middot; {formatCurrency(loan.loanAmount)}
                  {loan.propertyCity ? ` \u00b7 ${loan.propertyCity}, ${loan.propertyState}` : ''}
                </p>
              </div>

              {/* Stage badge */}
              <div className="shrink-0">
                <StageBadge stage={loan.status} />
              </div>

              {/* Time */}
              <span className="text-[10px] text-gray-400 shrink-0 w-14 text-right">
                {daysAgo(loan.updatedAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
