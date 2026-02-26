'use client';

import { Loan, PIPELINE_STAGES, STAGE_CONFIG } from '@/types';
import LoanCard from './loan-card';
import { formatCurrency } from '@/lib/utils';

interface KanbanBoardProps {
  loans: Loan[];
}

export default function KanbanBoard({ loans }: KanbanBoardProps) {
  return (
    <div className="flex gap-2 h-full overflow-x-auto">
      {PIPELINE_STAGES.map((stage) => {
        const stageLoans = loans.filter((l) => l.status === stage);
        const volume = stageLoans.reduce((sum, l) => sum + l.loanAmount, 0);
        const config = STAGE_CONFIG[stage];

        return (
          <div
            key={stage}
            className="flex flex-col min-w-[200px] flex-1 bg-slate-50 rounded-lg"
          >
            {/* Column header */}
            <div className="px-2.5 py-2 border-b border-slate-200/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">
                    {config.label}
                  </span>
                </div>
                <span
                  className="text-[10px] font-bold px-1 py-0.5 rounded"
                  style={{
                    color: config.color,
                    backgroundColor: config.bgColor,
                  }}
                >
                  {stageLoans.length}
                </span>
              </div>
              {volume > 0 && (
                <p className="text-[10px] text-slate-400 mt-0.5 ml-3.5">
                  {formatCurrency(volume)}
                </p>
              )}
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto px-1.5 py-1.5 space-y-1.5">
              {stageLoans.length === 0 ? (
                <div className="text-center py-6 text-[10px] text-slate-400">
                  No loans
                </div>
              ) : (
                stageLoans.map((loan) => (
                  <LoanCard key={loan.id} loan={loan} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
