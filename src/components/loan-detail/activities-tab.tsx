'use client';

import {
  ArrowRight,
  MessageSquare,
  FileText,
  Upload,
  User,
  AlertCircle,
  Activity,
} from 'lucide-react';
import type { LoanActivity } from '@/types';
import { formatDate, cn } from '@/lib/utils';

interface ActivitiesTabProps {
  activities: LoanActivity[];
}

const actionConfig: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  status_change:  { icon: ArrowRight,     color: 'text-blue-600',   bg: 'bg-blue-50' },
  note_added:     { icon: MessageSquare,  color: 'text-purple-600', bg: 'bg-purple-50' },
  document_added: { icon: Upload,         color: 'text-green-600',  bg: 'bg-green-50' },
  document_updated:{ icon: FileText,      color: 'text-amber-600',  bg: 'bg-amber-50' },
  loan_created:   { icon: User,           color: 'text-slate-600',  bg: 'bg-slate-100' },
  loan_updated:   { icon: FileText,       color: 'text-slate-600',  bg: 'bg-slate-100' },
  task_completed: { icon: Activity,       color: 'text-green-600',  bg: 'bg-green-50' },
  alert:          { icon: AlertCircle,    color: 'text-red-600',    bg: 'bg-red-50' },
};

const fallback = { icon: Activity, color: 'text-slate-500', bg: 'bg-slate-100' };

export function ActivitiesTab({ activities }: ActivitiesTabProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-white border border-slate-200 rounded-xl">
        <Activity size={28} className="text-slate-200 mb-2" />
        <p className="text-sm font-medium text-slate-500">No activity yet</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Status changes and updates will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200" aria-hidden="true" />

      <div className="space-y-0">
        {activities.map((activity, idx) => {
          const cfg = actionConfig[activity.action] ?? fallback;
          const Icon = cfg.icon;
          const isLast = idx === activities.length - 1;

          return (
            <div
              key={activity.id}
              className={cn('flex gap-4 pl-0 relative', !isLast && 'pb-4')}
            >
              {/* Icon bubble */}
              <div
                className={cn(
                  'shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10',
                  cfg.bg
                )}
              >
                <Icon size={14} className={cfg.color} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-xs text-slate-800 leading-snug">{activity.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400">{activity.performedBy}</span>
                  <span className="text-slate-200 text-[10px]">&middot;</span>
                  <span className="text-[10px] text-slate-400">{formatDate(activity.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActivitiesTab;
