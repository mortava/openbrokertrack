'use client';

import { Loan, PIPELINE_STAGES, STAGE_CONFIG } from '@/types';
import LoanCard from './loan-card';
import { formatCurrency } from '@/lib/utils';

interface KanbanBoardProps {
  loans: Loan[];
}

export default function KanbanBoard({ loans }: KanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full">
      {PIPELINE_STAGES.map((stage) => {
        const stageLoans = loans.filter((l) => l.status === stage);
        const volume = stageLoans.reduce((sum, l) => sum + l.loanAmount, 0);
        const config = STAGE_CONFIG[stage];

        return (
          <div
            key={stage}
            className="flex flex-col w-72 shrink-0 bg-slate-50 rounded-xl"
          >
            {/* Column header */}
            <div className="px-3 py-3 border-b border-slate-200/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    {config.label}
                  </span>
                </div>
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{
                    color: config.color,
                    backgroundColor: config.bgColor,
                  }}
                >
                  {stageLoans.length}
                </span>
              </div>
              {volume > 0 && (
                <p className="text-xs text-slate-400 mt-1 ml-4.5">
                  {formatCurrency(volume)}
                </p>
              )}
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
              {stageLoans.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
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
