'use client';

import { useLoans } from '@/hooks/useLoans';
import { formatCurrency } from '@/lib/utils';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const PURPOSE_CONFIG = {
  purchase:  { label: 'Purchase',  color: '#3b82f6' },
  refinance: { label: 'Refinance', color: '#10b981' },
  cashout:   { label: 'Cash-Out',  color: '#f59e0b' },
} as const;

type PurposeKey = keyof typeof PURPOSE_CONFIG;

export default function LoanPurposeChart() {
  const { loans, loading } = useLoans();

  const purposeData = (Object.keys(PURPOSE_CONFIG) as PurposeKey[]).map((key) => {
    const group = loans.filter((l) => l.loanPurpose === key);
    return {
      key,
      label: PURPOSE_CONFIG[key].label,
      color: PURPOSE_CONFIG[key].color,
      count: group.length,
      volume: group.reduce((s, l) => s + l.loanAmount, 0),
    };
  });

  const total = purposeData.reduce((s, p) => s + p.count, 0);
  const hasData = total > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 shrink-0">
        <h3 className="text-sm font-semibold text-gray-900">Loan Purpose</h3>
      </div>

      <div className="flex items-center gap-4 p-4">
        {/* Donut chart */}
        <div className="shrink-0 w-28 h-28">
          {loading ? (
            <div className="w-28 h-28 flex items-center justify-center">
              <div className="animate-spin w-6 h-6 border-2 border-[#171717] border-t-transparent rounded-full" />
            </div>
          ) : !hasData ? (
            <div className="w-28 h-28 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-8 border-gray-100 flex items-center justify-center">
                <span className="text-[10px] text-gray-400">No data</span>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={purposeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={48}
                  dataKey="count"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {purposeData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                  }}
                  formatter={(value: number | undefined) => [value ?? 0, 'Loans']}
                  labelStyle={{ fontWeight: 600, color: '#171717' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 min-w-0">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th className="text-left font-medium py-1 pr-2">Purpose</th>
                <th className="text-right font-medium py-1 pr-2">Loans</th>
                <th className="text-right font-medium py-1">Volume</th>
              </tr>
            </thead>
            <tbody>
              {purposeData.map((row) => (
                <tr key={row.key} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-1.5 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-sm shrink-0"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className="text-gray-700 font-medium">{row.label}</span>
                    </div>
                  </td>
                  <td className="text-right py-1.5 pr-2 text-gray-900 font-semibold tabular-nums">
                    {row.count}
                  </td>
                  <td className="text-right py-1.5 text-gray-500 tabular-nums">
                    {formatCurrency(row.volume)}
                  </td>
                </tr>
              ))}
              {total > 0 && (
                <tr className="border-t border-gray-200">
                  <td className="py-1.5 pr-2 text-gray-500 font-semibold">Total</td>
                  <td className="text-right py-1.5 pr-2 text-gray-900 font-bold tabular-nums">
                    {total}
                  </td>
                  <td className="text-right py-1.5 text-gray-700 font-semibold tabular-nums">
                    {formatCurrency(purposeData.reduce((s, p) => s + p.volume, 0))}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
