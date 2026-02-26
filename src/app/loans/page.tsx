'use client';

import Header from '@/components/header';
import LoansTable from '@/components/loans/loans-table';
import { mockLoans } from '@/lib/data';

export default function LoansPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header title="Loans" subtitle="All loans in your pipeline" />
      <div className="flex-1 overflow-y-auto p-6">
        <LoansTable loans={mockLoans} />
      </div>
    </div>
  );
}
