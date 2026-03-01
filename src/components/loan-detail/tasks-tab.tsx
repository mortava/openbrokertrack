'use client';

import { useState } from 'react';
import { Plus, CheckCircle2, Circle, AlertCircle, Clock, ChevronUp } from 'lucide-react';
import type { Task, TaskPriority } from '@/types';
import { createTask, completeTask } from '@/lib/mutations';
import { formatDate, cn } from '@/lib/utils';
import { TypeBadge } from '@/components/ui/badge';

interface TasksTabProps {
  loanId: string;
  tasks: Task[];
  onRefetch: () => void;
}

const priorityConfig: Record<
  TaskPriority,
  { label: string; variant: 'default' | 'amber' | 'red' | 'purple' }
> = {
  low:    { label: 'Low',    variant: 'default' },
  normal: { label: 'Normal', variant: 'default' },
  high:   { label: 'High',   variant: 'amber' },
  urgent: { label: 'Urgent', variant: 'red' },
};

const inputClass =
  'w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]/30 bg-white placeholder:text-gray-400';

export function TasksTab({ loanId, tasks, onRefetch }: TasksTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState<string | null>(null);

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    await createTask({
      loanId,
      title: title.trim(),
      dueDate: dueDate || undefined,
      priority,
      category: 'other',
    });
    setTitle('');
    setDueDate('');
    setPriority('normal');
    setShowForm(false);
    setSubmitting(false);
    onRefetch();
  }

  async function handleComplete(taskId: string) {
    setCompleting(taskId);
    await completeTask(taskId);
    setCompleting(null);
    onRefetch();
  }

  const open = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-gray-700">
          Tasks
          {open.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-900 rounded-full">
              {open.length} open
            </span>
          )}
        </h3>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1 text-[11px] font-medium text-[#171717] hover:text-[#171717]/70 transition-colors"
        >
          <Plus size={12} />
          Add Task
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <form
          onSubmit={handleAddTask}
          className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2"
        >
          <input
            type="text"
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            autoFocus
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={cn(inputClass, 'flex-1')}
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className={cn(inputClass, 'flex-1')}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1 text-[11px] text-gray-600 border border-gray-200 rounded-md hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="px-3 py-1 text-[11px] font-medium text-white bg-[#171717] rounded-md hover:bg-[#171717]/90 disabled:opacity-60"
            >
              {submitting ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      )}

      {/* Empty state */}
      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white border border-gray-200 rounded-xl">
          <CheckCircle2 size={28} className="text-gray-200 mb-2" />
          <p className="text-sm font-medium text-gray-500">No tasks yet</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Add tasks to track conditions and follow-ups.
          </p>
        </div>
      )}

      {/* Open tasks */}
      {open.length > 0 && (
        <div className="space-y-2">
          {open.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onComplete={() => handleComplete(task.id)}
              completing={completing === task.id}
            />
          ))}
        </div>
      )}

      {/* Completed tasks (collapsed) */}
      {done.length > 0 && (
        <CompletedSection tasks={done} />
      )}
    </div>
  );
}

function TaskRow({
  task,
  onComplete,
  completing,
}: {
  task: Task;
  onComplete: () => void;
  completing: boolean;
}) {
  const pc = priorityConfig[task.priority];
  const isOverdue =
    !task.completed && task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 bg-white border rounded-lg transition-colors',
        task.completed ? 'border-gray-100 opacity-60' : 'border-gray-200 hover:border-gray-300'
      )}
    >
      <button
        onClick={onComplete}
        disabled={task.completed || completing}
        className="shrink-0 mt-0.5 text-gray-300 hover:text-[#171717] transition-colors disabled:cursor-default"
      >
        {task.completed ? (
          <CheckCircle2 size={16} className="text-green-500" />
        ) : completing ? (
          <span className="w-4 h-4 border border-gray-300 border-t-[#171717] rounded-full animate-spin block" />
        ) : (
          <Circle size={16} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-xs font-medium text-gray-800',
            task.completed && 'line-through text-gray-400'
          )}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {task.dueDate && (
            <span
              className={cn(
                'flex items-center gap-0.5 text-[10px]',
                isOverdue ? 'text-red-500' : 'text-gray-400'
              )}
            >
              {isOverdue && <AlertCircle size={10} />}
              {!isOverdue && <Clock size={10} />}
              Due {formatDate(task.dueDate)}
            </span>
          )}
          <TypeBadge variant={pc.variant}>{pc.label}</TypeBadge>
        </div>
      </div>
    </div>
  );
}

function CompletedSection({ tasks }: { tasks: Task[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-700 mb-2"
      >
        <ChevronUp
          size={12}
          className={cn('transition-transform', open ? '' : 'rotate-180')}
        />
        {tasks.length} completed task{tasks.length !== 1 ? 's' : ''}
      </button>
      {open && (
        <div className="space-y-1.5">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onComplete={() => {}} completing={false} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TasksTab;
