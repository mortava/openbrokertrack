'use client';

import { PIPELINE_STAGES, STAGE_CONFIG, PipelineStage } from '@/types';

export interface PipelineFilters {
  stages: PipelineStage[];
  borrowerName: string;
  loanOfficer: string;
  loanType: string;
  purpose: string;
  creditScoreMin: string;
  creditScoreMax: string;
  amountMin: string;
  amountMax: string;
}

export const DEFAULT_FILTERS: PipelineFilters = {
  stages: [],
  borrowerName: '',
  loanOfficer: '',
  loanType: '',
  purpose: '',
  creditScoreMin: '',
  creditScoreMax: '',
  amountMin: '',
  amountMax: '',
};

interface PipelineFiltersProps {
  filters: PipelineFilters;
  onChange: (filters: PipelineFilters) => void;
  onClear: () => void;
}

const inputClass =
  'w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white placeholder:text-slate-400';

const selectClass =
  'w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white text-slate-700';

export function PipelineFilters({ filters, onChange, onClear }: PipelineFiltersProps) {
  function toggleStage(stage: PipelineStage) {
    const next = filters.stages.includes(stage)
      ? filters.stages.filter((s) => s !== stage)
      : [...filters.stages, stage];
    onChange({ ...filters, stages: next });
  }

  function set(key: keyof PipelineFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  const hasFilters =
    filters.stages.length > 0 ||
    filters.borrowerName !== '' ||
    filters.loanOfficer !== '' ||
    filters.loanType !== '' ||
    filters.purpose !== '' ||
    filters.creditScoreMin !== '' ||
    filters.creditScoreMax !== '' ||
    filters.amountMin !== '' ||
    filters.amountMax !== '';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 shrink-0">
        <span className="text-xs font-semibold text-slate-700">Filters</span>
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">

        {/* Status */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Status
          </p>
          <div className="space-y-1">
            {PIPELINE_STAGES.map((stage) => {
              const config = STAGE_CONFIG[stage];
              const checked = filters.stages.includes(stage);
              return (
                <label
                  key={stage}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleStage(stage)}
                    className="w-3.5 h-3.5 rounded border-slate-300 accent-blue-600"
                  />
                  <span className="flex items-center gap-1.5 text-xs text-slate-700 group-hover:text-slate-900">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: config.color }}
                    />
                    {config.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Borrower Name */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Borrower Name
          </label>
          <input
            type="text"
            placeholder="Search name..."
            value={filters.borrowerName}
            onChange={(e) => set('borrowerName', e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Loan Officer */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Loan Officer
          </label>
          <input
            type="text"
            placeholder="Search LO..."
            value={filters.loanOfficer}
            onChange={(e) => set('loanOfficer', e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Loan Type */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Loan Type
          </label>
          <select
            value={filters.loanType}
            onChange={(e) => set('loanType', e.target.value)}
            className={selectClass}
          >
            <option value="">All Types</option>
            <option value="conventional">Conventional</option>
            <option value="fha">FHA</option>
            <option value="va">VA</option>
            <option value="nonqm">NonQM</option>
            <option value="jumbo">Jumbo</option>
          </select>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Purpose
          </label>
          <select
            value={filters.purpose}
            onChange={(e) => set('purpose', e.target.value)}
            className={selectClass}
          >
            <option value="">All Purposes</option>
            <option value="purchase">Purchase</option>
            <option value="refinance">Refinance</option>
            <option value="cashout">Cash-Out</option>
          </select>
        </div>

        {/* Credit Score Range */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Credit Score
          </p>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Min"
              value={filters.creditScoreMin}
              onChange={(e) => set('creditScoreMin', e.target.value)}
              className={inputClass}
            />
            <span className="text-slate-400 text-xs shrink-0">–</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.creditScoreMax}
              onChange={(e) => set('creditScoreMax', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Loan Amount Range */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Loan Amount
          </p>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Min $"
              value={filters.amountMin}
              onChange={(e) => set('amountMin', e.target.value)}
              className={inputClass}
            />
            <span className="text-slate-400 text-xs shrink-0">–</span>
            <input
              type="number"
              placeholder="Max $"
              value={filters.amountMax}
              onChange={(e) => set('amountMax', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PipelineFilters;
