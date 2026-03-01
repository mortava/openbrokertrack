'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { completeTask, createTask } from '@/lib/mutations';
import { useAuth } from '@/contexts/auth-context';
import {
  Target,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  Plus,
  X,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TaskPriority } from '@/types';

const priorityConfig: Record<TaskPriority, { dot: string; label: string }> = {
  urgent: { dot: 'bg-red-500', label: 'Urgent' },
  high:   { dot: 'bg-orange-500', label: 'High' },
  normal: { dot: 'bg-gray-500', label: 'Normal' },
  low:    { dot: 'bg-gray-400', label: 'Low' },
};

export default function TodaysGoals() {
  const { grouped, loading, refetch } = useTasks();
  const { currentUser } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('normal');
  const [adding, setAdding] = useState(false);
  const [completingIds, setCompletingIds] = useState<Set<string>>(new Set());

  const overdue = grouped.overdue;
  const today = grouped.dueToday;
  const allItems = [...overdue, ...today];
  const completedToday = completingIds.size;

  async function handleComplete(id: string) {
    setCompletingIds((prev) => new Set(prev).add(id));
    await completeTask(id);
    // Short delay for animation
    setTimeout(() => {
      refetch();
      setCompletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 600);
  }

  async function handleQuickAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    await createTask({
      loanId: '',
      title: newTitle.trim(),
      priority: newPriority,
      category: 'follow-up',
      assignedTo: currentUser.fullName,
      dueDate: new Date().toISOString().split('T')[0],
    });
    setNewTitle('');
    setNewPriority('normal');
    setShowAdd(false);
    setAdding(false);
    refetch();
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
        <div className="h-5 bg-gray-100 rounded w-40 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-5 h-5 bg-gray-100 rounded-full" />
              <div className="flex-1 h-4 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
            <Target size={14} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Today&apos;s Goals</h3>
            <p className="text-[10px] text-gray-400">
              {allItems.length} task{allItems.length !== 1 ? 's' : ''} remaining
              {completedToday > 0 && (
                <span className="text-green-500 ml-1">&middot; {completedToday} done</span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#171717] transition-colors"
          title="Add task"
        >
          {showAdd ? <X size={14} /> : <Plus size={14} />}
        </button>
      </div>

      {/* Quick add form */}
      {showAdd && (
        <form onSubmit={handleQuickAdd} className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What needs to be done today?"
              className="flex-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]/30 bg-white placeholder:text-gray-400"
              autoFocus
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
              className="px-2 py-1.5 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <button
              type="submit"
              disabled={adding || !newTitle.trim()}
              className="px-3 py-1.5 text-xs font-medium text-white bg-[#171717] rounded-md hover:bg-[#171717]/90 disabled:opacity-50 transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {/* Task list */}
      <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
        {/* Overdue section */}
        {overdue.length > 0 && (
          <div className="px-4 py-2 bg-red-50/50">
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle size={11} className="text-red-500" />
              <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">
                Overdue ({overdue.length})
              </span>
            </div>
            <div className="space-y-0.5">
              {overdue.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isOverdue
                  completing={completingIds.has(task.id)}
                  onComplete={() => handleComplete(task.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Today section */}
        {today.length > 0 && (
          <div className="px-4 py-2">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Clock size={11} className="text-amber-500" />
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Due Today ({today.length})
              </span>
            </div>
            <div className="space-y-0.5">
              {today.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isOverdue={false}
                  completing={completingIds.has(task.id)}
                  onComplete={() => handleComplete(task.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {allItems.length === 0 && (
          <div className="px-4 py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
              <Flame size={18} className="text-green-500" />
            </div>
            <p className="text-sm font-medium text-gray-600">All clear!</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              No tasks due today. Add a new goal to stay productive.
            </p>
          </div>
        )}
      </div>

      {/* Footer with streak/progress */}
      {allItems.length > 0 && (
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">
              {overdue.length > 0
                ? `${overdue.length} overdue — tackle these first`
                : 'Stay on track today'}
            </span>
            <div className="flex gap-1">
              {allItems.slice(0, 8).map((t, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    completingIds.has(t.id) ? 'bg-green-400' : 'bg-gray-300'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskItem({
  task,
  isOverdue,
  completing,
  onComplete,
}: {
  task: { id: string; title: string; priority: TaskPriority; category: string };
  isOverdue: boolean;
  completing: boolean;
  onComplete: () => void;
}) {
  const cfg = priorityConfig[task.priority];

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-lg group transition-all duration-300',
        completing && 'opacity-50 line-through',
        !completing && 'hover:bg-white/80',
      )}
    >
      <button
        onClick={onComplete}
        disabled={completing}
        className="shrink-0 transition-colors"
        title="Mark complete"
      >
        {completing ? (
          <CheckCircle2 size={16} className="text-green-500" />
        ) : (
          <Circle
            size={16}
            className={cn(
              'transition-colors',
              isOverdue
                ? 'text-red-300 hover:text-green-500'
                : 'text-gray-300 hover:text-green-500'
            )}
          />
        )}
      </button>

      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
        <span
          className={cn(
            'text-xs truncate',
            isOverdue ? 'text-red-700 font-medium' : 'text-gray-700',
          )}
        >
          {task.title}
        </span>
      </div>

      <span className="text-[9px] text-gray-400 uppercase tracking-wide shrink-0 hidden group-hover:block">
        {task.category}
      </span>
      <ChevronRight size={12} className="text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
