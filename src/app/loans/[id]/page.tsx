'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, LayoutGrid, CheckSquare, MessageSquare, Activity, Folder, ShieldCheck } from 'lucide-react';
import { useLoan } from '@/hooks/useLoan';
import { DetailHeader } from '@/components/loan-detail/detail-header';
import { OverviewTab } from '@/components/loan-detail/overview-tab';
import { TasksTab } from '@/components/loan-detail/tasks-tab';
import { NotesTab } from '@/components/loan-detail/notes-tab';
import { ActivitiesTab } from '@/components/loan-detail/activities-tab';
import { DocumentsTab } from '@/components/loan-detail/documents-tab';
import { ConditionsTab } from '@/components/loan-detail/conditions-tab';
import { sendNotification } from '@/lib/notifications';
import { cn } from '@/lib/utils';

type TabId = 'overview' | 'tasks' | 'conditions' | 'notes' | 'documents' | 'activities';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
  countKey?: 'tasks' | 'notes' | 'documents' | 'activities';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',   label: 'Overview',    icon: LayoutGrid },
  { id: 'tasks',      label: 'Tasks',       icon: CheckSquare,   countKey: 'tasks' },
  { id: 'conditions', label: 'Conditions',  icon: ShieldCheck },
  { id: 'notes',      label: 'Notes',       icon: MessageSquare, countKey: 'notes' },
  { id: 'documents',  label: 'Documents',   icon: Folder,        countKey: 'documents' },
  { id: 'activities', label: 'Activity',    icon: Activity,      countKey: 'activities' },
];

export default function LoanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { loan, tasks, notes, documents, activities, loading, error, refetch } = useLoan(id);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const counts = {
    tasks:      tasks.filter((t) => !t.completed).length,
    notes:      notes.length,
    documents:  documents.length,
    activities: activities.length,
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-6 h-6 border-2 border-[#171717] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Error / not found
  if (error || !loan) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-sm font-medium text-gray-700">
          {error ?? 'Loan not found'}
        </p>
        <Link
          href="/pipeline"
          className="flex items-center gap-1.5 text-xs text-[#171717] hover:text-[#171717]/70"
        >
          <ArrowLeft size={13} />
          Back to Pipeline
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top header */}
      <DetailHeader loan={loan} onRefetch={refetch} />

      {/* Body: sidebar nav + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar navigation */}
        <nav className="w-44 shrink-0 border-r border-gray-200 bg-white py-3 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const count = item.countKey ? counts[item.countKey] : undefined;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-colors text-left',
                  isActive
                    ? 'text-[#171717] bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <Icon size={14} className="shrink-0" />
                <span className="flex-1">{item.label}</span>
                {count !== undefined && count > 0 && (
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                      isActive
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Tab content */}
        <main className="flex-1 overflow-y-auto bg-[#FAFAFA] p-5">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'overview' && (
              <OverviewTab loan={loan} onRefetch={refetch} />
            )}
            {activeTab === 'tasks' && (
              <TasksTab loanId={loan.id} tasks={tasks} onRefetch={refetch} />
            )}
            {activeTab === 'notes' && (
              <NotesTab loanId={loan.id} notes={notes} onRefetch={refetch} />
            )}
            {activeTab === 'conditions' && (
              <ConditionsTab
                loanId={loan.id}
                onNotify={(subject, body) => {
                  const loanRef = `Loan: ${loan.borrowerName} — ${loan.loanNumber || loan.id.slice(0, 8)}`;
                  sendNotification(
                    `[OBT] ${subject}`,
                    `${body}<br/><br/><strong>${loanRef}</strong>`
                  );
                }}
              />
            )}
            {activeTab === 'documents' && (
              <DocumentsTab loanId={loan.id} documents={documents} onRefetch={refetch} />
            )}
            {activeTab === 'activities' && (
              <ActivitiesTab activities={activities} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
