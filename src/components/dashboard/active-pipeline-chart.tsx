'use client';

import { useLoans } from '@/hooks/useLoans';
import { PIPELINE_ACTIVE_STAGES, STAGE_CONFIG } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Download, Settings2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function ActivePipelineChart() {
  const { loans, loading } = useLoans();

  const stageData = PIPELINE_ACTIVE_STAGES.map((stage) => {
    const stageLoans = loans.filter((l) => l.status === stage);
    const volume = stageLoans.reduce((s, l) => s + l.loanAmount, 0);
    return {
      stage,
      label: STAGE_CONFIG[stage].label,
      count: stageLoans.length,
      volume,
      color: STAGE_CONFIG[stage].color,
    };
  });

  const hasData = stageData.some((s) => s.count > 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
        <h3 className="text-sm font-semibold text-slate-900">Active Pipeline</h3>
        <div className="flex items-center gap-1">
          <button className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors" title="Download">
            <Download size={14} />
          </button>
          <button className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors" title="Settings">
            <Settings2 size={14} />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pt-4 pb-2">
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : !hasData ? (
          <div className="h-40 flex items-center justify-center text-slate-400 text-xs">
            No active pipeline data
          </div>
        ) : (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 9, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: number | undefined) => [value ?? 0, 'Loans']}
                  labelStyle={{ fontWeight: 600, color: '#0f172a' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stageData.map((entry) => (
                    <Cell key={entry.stage} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="px-4 pb-4">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-slate-400 border-b border-slate-100">
              <th className="text-left font-medium py-1.5 pr-2">Stage</th>
              <th className="text-right font-medium py-1.5 pr-2">Loans</th>
              <th className="text-right font-medium py-1.5">Volume</th>
            </tr>
          </thead>
          <tbody>
            {stageData.map((row) => (
              <tr key={row.stage} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                <td className="py-1.5 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: row.color }}
                    />
                    <span className="text-slate-700 font-medium">{row.label}</span>
                  </div>
                </td>
                <td className="text-right py-1.5 pr-2 text-slate-900 font-semibold tabular-nums">
                  {row.count}
                </td>
                <td className="text-right py-1.5 text-slate-500 tabular-nums">
                  {formatCurrency(row.volume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
