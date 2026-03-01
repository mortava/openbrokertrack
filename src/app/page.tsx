'use client';

import TaskSummaryCards from '@/components/dashboard/task-summary-cards';
import TodaysGoals from '@/components/dashboard/todays-goals';
import LastModifiedLoans from '@/components/dashboard/last-modified-loans';
import ActivePipelineChart from '@/components/dashboard/active-pipeline-chart';
import LoanPurposeChart from '@/components/dashboard/loan-purpose-chart';
import FundingHistory from '@/components/dashboard/funding-history';

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#FAFAFA]">
      <div className="p-6 space-y-5">
        {/* Welcome row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Welcome, James</h1>
            <p className="text-xs text-gray-500 mt-0.5">
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

        {/* Today's Goals + Recent Loans row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-1">
            <TodaysGoals />
          </div>
          <div className="xl:col-span-2">
            <LastModifiedLoans />
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <ActivePipelineChart />
          <div className="flex flex-col gap-5">
            <LoanPurposeChart />
            <FundingHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
