'use client';

import { useTasks } from '@/hooks/useTasks';
import { AlertCircle, Clock, Calendar } from 'lucide-react';

export default function TaskSummaryCards() {
  const { grouped, tasks, loading } = useTasks();

  if (loading) {
    return (
      <div className="flex gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-1 bg-white rounded-lg border border-slate-200 p-3 animate-pulse">
            <div className="h-6 bg-slate-100 rounded mb-1" />
            <div className="h-3 bg-slate-100 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  const totalOpen = tasks.filter((t) => !t.completed).length;

  const cards = [
    {
      label: 'My Tasks',
      sublabel: 'Open tasks',
      value: totalOpen,
      overdue: grouped.overdue.length,
      today: grouped.dueToday.length,
      borderColor: grouped.overdue.length > 0 ? 'border-l-red-500' : grouped.dueToday.length > 0 ? 'border-l-amber-500' : 'border-l-blue-500',
      icon: <AlertCircle size={14} className={grouped.overdue.length > 0 ? 'text-red-500' : 'text-blue-500'} />,
      showSubCounts: true,
    },
    {
      label: '3 Day',
      sublabel: 'Due in 3 days',
      value: grouped.upcoming3Day.length,
      borderColor: 'border-l-blue-400',
      icon: <Calendar size={14} className="text-blue-400" />,
      showSubCounts: false,
    },
    {
      label: '10 Day',
      sublabel: 'Due in 10 days',
      value: grouped.upcoming10Day.length,
      borderColor: 'border-l-blue-500',
      icon: <Calendar size={14} className="text-blue-500" />,
      showSubCounts: false,
    },
    {
      label: '30 Day',
      sublabel: 'Due in 30 days',
      value: grouped.upcoming30Day.length,
      borderColor: 'border-l-indigo-500',
      icon: <Clock size={14} className="text-indigo-500" />,
      showSubCounts: false,
    },
  ];

  return (
    <div className="flex gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`flex-1 bg-white rounded-lg border border-slate-200 border-l-4 ${card.borderColor} p-3 hover:shadow-sm transition-shadow cursor-pointer`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              {card.label}
            </span>
            {card.icon}
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums leading-none">
            {card.value}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{card.sublabel}</div>
          {card.showSubCounts && (card.overdue! > 0 || card.today! > 0) && (
            <div className="flex gap-2 mt-1.5">
              {card.overdue! > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
                  {card.overdue} overdue
                </span>
              )}
              {card.today! > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-amber-500 inline-block" />
                  {card.today} today
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
