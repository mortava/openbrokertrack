'use client';

import { useLoans } from '@/hooks/useLoans';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

interface MonthBucket {
  key: string;    // "2025-01"
  label: string;  // "Jan 2025"
  count: number;
  volume: number;
}

function getMonthLabel(key: string): string {
  const [year, month] = key.split('-');
  const d = new Date(parseInt(year), parseInt(month) - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function FundingHistory() {
  const { loans, loading } = useLoans();

  // Build last 12 month buckets
  const now = new Date();
  const bucketKeys: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    bucketKeys.push(key);
  }

  const funded = loans.filter((l) => l.status === 'funded');

  const bucketsMap: Record<string, MonthBucket> = {};
  bucketKeys.forEach((key) => {
    bucketsMap[key] = { key, label: getMonthLabel(key), count: 0, volume: 0 };
  });

  funded.forEach((loan) => {
    // Prefer fundingDate, fall back to createdAt
    const dateStr = loan.fundingDate ?? loan.createdAt;
    const d = new Date(dateStr);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (bucketsMap[key]) {
      bucketsMap[key].count += 1;
      bucketsMap[key].volume += loan.loanAmount;
    }
  });

  const rows = bucketKeys.map((k) => bucketsMap[k]).reverse(); // newest first

  const totalCount = rows.reduce((s, r) => s + r.count, 0);
  const totalVolume = rows.reduce((s, r) => s + r.volume, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-green-600" />
          <h3 className="text-sm font-semibold text-slate-900">Funding History</h3>
        </div>
        <span className="text-[10px] text-slate-400">Last 12 months</span>
      </div>

      {loading ? (
        <div className="p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="h-3 bg-slate-100 rounded w-16" />
              <div className="h-3 bg-slate-100 rounded w-8 ml-auto" />
              <div className="h-3 bg-slate-100 rounded w-20" />
            </div>
          ))}
        </div>
      ) : totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
          <TrendingUp size={24} className="mb-2 opacity-30" />
          <p className="text-xs font-medium">No funded loans yet</p>
          <p className="text-[10px] mt-0.5">Funded loans will appear here</p>
        </div>
      ) : (
        <>
          <div className="overflow-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 sticky top-0 bg-white">
                  <th className="text-left font-medium px-4 py-2">Period</th>
                  <th className="text-right font-medium px-4 py-2"># Loans</th>
                  <th className="text-right font-medium px-4 py-2">Total Volume</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.key}
                    className={`border-b border-slate-50 last:border-0 transition-colors ${
                      row.count > 0 ? 'hover:bg-slate-50' : ''
                    }`}
                  >
                    <td className={`px-4 py-1.5 font-medium ${row.count > 0 ? 'text-slate-800' : 'text-slate-300'}`}>
                      {row.label}
                    </td>
                    <td className={`px-4 py-1.5 text-right tabular-nums font-semibold ${row.count > 0 ? 'text-slate-900' : 'text-slate-300'}`}>
                      {row.count > 0 ? row.count : '-'}
                    </td>
                    <td className={`px-4 py-1.5 text-right tabular-nums ${row.count > 0 ? 'text-green-700 font-medium' : 'text-slate-300'}`}>
                      {row.count > 0 ? formatCurrency(row.volume) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td className="px-4 py-2 font-bold text-slate-700">Total</td>
                  <td className="px-4 py-2 text-right font-bold text-slate-900 tabular-nums">
                    {totalCount}
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-green-700 tabular-nums">
                    {formatCurrency(totalVolume)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
