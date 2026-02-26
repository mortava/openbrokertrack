'use client';

import { Loan, PIPELINE_STAGES, STAGE_CONFIG } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface PipelineFunnelProps {
  loans: Loan[];
}

export default function PipelineFunnel({ loans }: PipelineFunnelProps) {
  const stageData = PIPELINE_STAGES.map((stage) => {
    const stageLoans = loans.filter((l) => l.status === stage);
    const volume = stageLoans.reduce((sum, l) => sum + l.loanAmount, 0);
    return { stage, count: stageLoans.length, volume, config: STAGE_CONFIG[stage] };
  });

  const maxCount = Math.max(...stageData.map((s) => s.count), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">
        Pipeline Overview
      </h3>
      <div className="space-y-3">
        {stageData.map((item) => (
          <div key={item.stage} className="flex items-center gap-3">
            <div className="w-28 shrink-0">
              <p className="text-xs font-medium text-slate-600">
                {item.config.label}
              </p>
            </div>
            <div className="flex-1 h-8 bg-slate-50 rounded-lg overflow-hidden relative">
              <div
                className="h-full rounded-lg transition-all duration-500"
                style={{
                  width: `${Math.max((item.count / maxCount) * 100, 4)}%`,
                  backgroundColor: item.config.color,
                  opacity: 0.15,
                }}
              />
              <div
                className="absolute inset-0 h-full rounded-lg"
                style={{
                  width: `${Math.max((item.count / maxCount) * 100, 4)}%`,
                  borderLeft: `3px solid ${item.config.color}`,
                }}
              />
              <div className="absolute inset-0 flex items-center px-3">
                <span
                  className="text-xs font-semibold"
                  style={{ color: item.config.color }}
                >
                  {item.count}
                </span>
              </div>
            </div>
            <div className="w-24 text-right shrink-0">
              <span className="text-xs text-slate-500">
                {formatCurrency(item.volume)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
