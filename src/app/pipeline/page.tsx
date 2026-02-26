'use client';

import { useState, useMemo } from 'react';
import { Plus, SlidersHorizontal, X } from 'lucide-react';
import { useLoans } from '@/hooks/useLoans';
import { PipelineList } from '@/components/pipeline/pipeline-list';
import { PipelineFilters, DEFAULT_FILTERS } from '@/components/pipeline/pipeline-filters';
import type { PipelineFilters as FiltersType } from '@/components/pipeline/pipeline-filters';
import { CreateLoanModal } from '@/components/pipeline/create-loan-modal';
import { cn } from '@/lib/utils';

export default function PipelinePage() {
  const { loans, loading, error, refetch } = useLoans();
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [filters, setFilters] = useState<FiltersType>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    return loans.filter((loan) => {
      if (filters.stages.length > 0 && !filters.stages.includes(loan.status)) return false;

      if (
        filters.borrowerName &&
        !loan.borrowerName.toLowerCase().includes(filters.borrowerName.toLowerCase())
      )
        return false;

      if (
        filters.loanOfficer &&
        !(loan.loanOfficer ?? '').toLowerCase().includes(filters.loanOfficer.toLowerCase())
      )
        return false;

      if (filters.loanType && loan.loanType !== filters.loanType) return false;
      if (filters.purpose && loan.loanPurpose !== filters.purpose) return false;

      if (filters.creditScoreMin && loan.creditScore < Number(filters.creditScoreMin))
        return false;
      if (filters.creditScoreMax && loan.creditScore > Number(filters.creditScoreMax))
        return false;

      if (filters.amountMin && loan.loanAmount < Number(filters.amountMin)) return false;
      if (filters.amountMax && loan.loanAmount > Number(filters.amountMax)) return false;

      return true;
    });
  }, [loans, filters]);

  const hasActiveFilters =
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
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-slate-900">Pipeline</h1>
          {!loading && (
            <span className="text-[11px] text-slate-500 tabular-nums">
              {filtered.length}{' '}
              {filtered.length !== loans.length && (
                <span className="text-slate-400">of {loans.length} </span>
              )}
              loan{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
          {hasActiveFilters && (
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full"
            >
              <X size={10} />
              Clear filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
              showFilters
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            )}
          >
            <SlidersHorizontal size={13} />
            Filters
            {hasActiveFilters && (
              <span className="w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {[
                  filters.stages.length > 0,
                  filters.borrowerName !== '',
                  filters.loanOfficer !== '',
                  filters.loanType !== '',
                  filters.purpose !== '',
                  filters.creditScoreMin !== '' || filters.creditScoreMax !== '',
                  filters.amountMin !== '' || filters.amountMax !== '',
                ].filter(Boolean).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            <Plus size={13} />
            Create
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Table area */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-sm font-medium text-red-600 mb-1">Failed to load loans</p>
                <p className="text-xs text-slate-500 mb-3">{error}</p>
                <button
                  onClick={refetch}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <PipelineList loans={filtered} />
          )}
        </div>

        {/* Filters sidebar */}
        {showFilters && (
          <div className="w-56 shrink-0 border-l border-slate-200 bg-white overflow-y-auto">
            <PipelineFilters
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(DEFAULT_FILTERS)}
            />
          </div>
        )}
      </div>

      {/* Create Loan Modal */}
      <CreateLoanModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
