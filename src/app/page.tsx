'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/header';
import StatsCards from '@/components/dashboard/stats-cards';
import PipelineFunnel from '@/components/dashboard/pipeline-funnel';
import RecentActivity from '@/components/dashboard/recent-activity';
import { supabase, dbToLoan } from '@/lib/supabase';
import type { Loan } from '@/types';

export default function DashboardPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLoans() {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!error && data) {
        setLoans(data.map(dbToLoan));
      }
      setLoading(false);
    }
    fetchLoans();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" subtitle="Loan pipeline overview" />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            <StatsCards loans={loans} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PipelineFunnel loans={loans} />
              <RecentActivity loans={loans} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
