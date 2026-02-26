'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, dbToTask } from '@/lib/supabase';
import type { Task } from '@/types';

interface GroupedTasks {
  overdue: Task[];
  dueToday: Task[];
  upcoming3Day: Task[];
  upcoming10Day: Task[];
  upcoming30Day: Task[];
  later: Task[];
}

interface UseTasksResult {
  tasks: Task[];
  grouped: GroupedTasks;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function groupTasks(tasks: Task[]): GroupedTasks {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const in3Days  = new Date(startOfToday); in3Days.setDate(startOfToday.getDate() + 3);
  const in10Days = new Date(startOfToday); in10Days.setDate(startOfToday.getDate() + 10);
  const in30Days = new Date(startOfToday); in30Days.setDate(startOfToday.getDate() + 30);

  const groups: GroupedTasks = {
    overdue: [],
    dueToday: [],
    upcoming3Day: [],
    upcoming10Day: [],
    upcoming30Day: [],
    later: [],
  };

  for (const task of tasks) {
    if (task.completed) continue;

    if (!task.dueDate) {
      groups.later.push(task);
      continue;
    }

    const due = new Date(task.dueDate);
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

    if (dueDay < startOfToday) {
      groups.overdue.push(task);
    } else if (dueDay.getTime() === startOfToday.getTime()) {
      groups.dueToday.push(task);
    } else if (dueDay < in3Days) {
      groups.upcoming3Day.push(task);
    } else if (dueDay < in10Days) {
      groups.upcoming10Day.push(task);
    } else if (dueDay < in30Days) {
      groups.upcoming30Day.push(task);
    } else {
      groups.later.push(task);
    }
  }

  return groups;
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function fetchTasks() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setTasks((data ?? []).map(dbToTask));
      setLoading(false);
    }

    fetchTasks();

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const grouped = useMemo(() => groupTasks(tasks), [tasks]);

  return { tasks, grouped, loading, error, refetch };
}
