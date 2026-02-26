'use client';

import TaskSummaryCards from '@/components/dashboard/task-summary-cards';
import LastModifiedLoans from '@/components/dashboard/last-modified-loans';
import ActivePipelineChart from '@/components/dashboard/active-pipeline-chart';
import LoanPurposeChart from '@/components/dashboard/loan-purpose-chart';
import FundingHistory from '@/components/dashboard/funding-history';

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
      <div className="p-5 space-y-5">
        {/* Welcome row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Welcome, James</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Task summary cards */}
        <TaskSummaryCards />

        {/* Main two-column grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Left column */}
          <div className="flex flex-col gap-5">
            <LastModifiedLoans />
            <ActivePipelineChart />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            <LoanPurposeChart />
            <FundingHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
