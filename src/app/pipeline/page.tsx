'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/header';
import KanbanBoard from '@/components/pipeline/kanban-board';
import { supabase, dbToLoan } from '@/lib/supabase';
import type { Loan } from '@/types';

export default function PipelinePage() {
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
      <Header title="Pipeline" subtitle="Drag loans through your workflow" />
      <div className="flex-1 overflow-hidden p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <KanbanBoard loans={loans} />
        )}
      </div>
    </div>
  );
}
