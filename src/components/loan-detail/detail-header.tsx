'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Edit2, Check, X } from 'lucide-react';
import type { Loan, PipelineStage } from '@/types';
import { PIPELINE_STAGES, STAGE_CONFIG } from '@/types';
import { StageBadge } from '@/components/ui/badge';
import { updateLoanStatus } from '@/lib/mutations';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DetailHeaderProps {
  loan: Loan;
  onRefetch: () => void;
}

export function DetailHeader({ loan, onRefetch }: DetailHeaderProps) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleStatusChange(stage: PipelineStage) {
    if (stage === loan.status) {
      setStatusOpen(false);
      return;
    }
    setChangingStatus(true);
    setStatusOpen(false);
    await updateLoanStatus(loan.id, stage, 'User');
    setChangingStatus(false);
    onRefetch();
  }

  const loanLabel = loan.loanNumber ?? `LN-${loan.id.slice(0, 6).toUpperCase()}`;

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
        <Link
          href="/pipeline"
          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={13} />
          Pipeline
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-400">{loanLabel}</span>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-700 truncate max-w-[200px]">
          {loan.borrowerName}
        </span>
      </div>

      {/* Main row */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-lg font-bold text-slate-900 truncate">
              {loan.borrowerName}
            </h1>
            {loan.borrowerName2 && (
              <span className="text-sm text-slate-500">& {loan.borrowerName2}</span>
            )}

            {/* Status badge + dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setStatusOpen((v) => !v)}
                disabled={changingStatus}
                className="flex items-center gap-1 rounded-full transition-opacity hover:opacity-80 disabled:opacity-50"
                title="Change status"
              >
                <StageBadge stage={loan.status} size="md" />
                <ChevronDown size={12} className="text-slate-400 -ml-0.5" />
              </button>

              {statusOpen && (
                <div className="absolute top-full left-0 mt-1 z-20 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 overflow-hidden">
                  {PIPELINE_STAGES.map((stage) => {
                    const config = STAGE_CONFIG[stage];
                    const isActive = stage === loan.status;
                    return (
                      <button
                        key={stage}
                        onClick={() => handleStatusChange(stage)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors text-left"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: config.color }}
                        />
                        <span
                          className={isActive ? 'font-semibold text-slate-900' : 'text-slate-700'}
                        >
                          {config.label}
                        </span>
                        {isActive && (
                          <Check size={11} className="ml-auto text-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-0.5">
            {loanLabel} &middot; {loan.propertyAddress}, {loan.propertyCity},{' '}
            {loan.propertyState}
          </p>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="flex items-center gap-5 mt-4 flex-wrap">
        <QuickStat label="Loan Amount" value={formatCurrency(loan.loanAmount)} />
        <QuickStat label="LTV" value={`${loan.ltv.toFixed(1)}%`} />
        <QuickStat label="FICO" value={String(loan.creditScore)} />
        <QuickStat
          label="Rate"
          value={loan.rate ? `${loan.rate.toFixed(3)}%` : '—'}
          dimEmpty={!loan.rate}
        />
        <QuickStat
          label="Lock Expiry"
          value={loan.lockExpiry ? formatDate(loan.lockExpiry) : '—'}
          dimEmpty={!loan.lockExpiry}
        />
        <QuickStat label="Loan Officer" value={loan.loanOfficer ?? '—'} dimEmpty={!loan.loanOfficer} />
        {loan.program && <QuickStat label="Program" value={loan.program} />}
      </div>
    </div>
  );
}

function QuickStat({
  label,
  value,
  dimEmpty,
}: {
  label: string;
  value: string;
  dimEmpty?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`text-sm font-semibold tabular-nums ${
          dimEmpty ? 'text-slate-300' : 'text-slate-800'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default DetailHeader;
