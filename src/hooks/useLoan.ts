'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, dbToLoan, dbToTask, dbToNote, dbToDocument, dbToActivity } from '@/lib/supabase';
import type { Loan, Task, LoanNote, LoanDocument, LoanActivity } from '@/types';

interface UseLoanResult {
  loan: Loan | null;
  tasks: Task[];
  notes: LoanNote[];
  documents: LoanDocument[];
  activities: LoanActivity[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLoan(id: string | null | undefined): UseLoanResult {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<LoanNote[]>([]);
  const [documents, setDocuments] = useState<LoanDocument[]>([]);
  const [activities, setActivities] = useState<LoanActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!id) {
      setLoan(null);
      setTasks([]);
      setNotes([]);
      setDocuments([]);
      setActivities([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      setError(null);

      const [loanRes, tasksRes, notesRes, docsRes, activitiesRes] = await Promise.all([
        supabase.from('loans').select('*').eq('id', id).single(),
        supabase
          .from('tasks')
          .select('*')
          .eq('loan_id', id)
          .order('due_date', { ascending: true }),
        supabase
          .from('loan_notes')
          .select('*')
          .eq('loan_id', id)
          .order('pinned', { ascending: false })
          .order('created_at', { ascending: false }),
        supabase
          .from('loan_documents')
          .select('*')
          .eq('loan_id', id)
          .order('created_at', { ascending: false }),
        supabase
          .from('loan_activities')
          .select('*')
          .eq('loan_id', id)
          .order('created_at', { ascending: false }),
      ]);

      if (cancelled) return;

      if (loanRes.error) {
        setError(loanRes.error.message);
        setLoading(false);
        return;
      }

      setLoan(loanRes.data ? dbToLoan(loanRes.data) : null);
      setTasks((tasksRes.data ?? []).map(dbToTask));
      setNotes((notesRes.data ?? []).map(dbToNote));
      setDocuments((docsRes.data ?? []).map(dbToDocument));
      setActivities((activitiesRes.data ?? []).map(dbToActivity));
      setLoading(false);
    }

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, [id, tick]);

  return { loan, tasks, notes, documents, activities, loading, error, refetch };
}
