'use client';

import Header from '@/components/header';
import KanbanBoard from '@/components/pipeline/kanban-board';
import { mockLoans } from '@/lib/data';

export default function PipelinePage() {
  return (
    <div className="flex flex-col h-screen">
      <Header title="Pipeline" subtitle="Drag loans through your workflow" />
      <div className="flex-1 overflow-hidden p-6">
        <KanbanBoard loans={mockLoans} />
      </div>
    </div>
  );
}
