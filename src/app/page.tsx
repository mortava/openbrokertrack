'use client';

import Header from '@/components/header';
import StatsCards from '@/components/dashboard/stats-cards';
import PipelineFunnel from '@/components/dashboard/pipeline-funnel';
import RecentActivity from '@/components/dashboard/recent-activity';
import { mockLoans } from '@/lib/data';

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header title="Dashboard" subtitle="Loan pipeline overview" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <StatsCards loans={mockLoans} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PipelineFunnel loans={mockLoans} />
          <RecentActivity loans={mockLoans} />
        </div>
      </div>
    </div>
  );
}
