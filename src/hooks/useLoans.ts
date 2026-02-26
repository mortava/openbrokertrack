'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, dbToLoan } from '@/lib/supabase';
import type { Loan } from '@/types';

interface UseLoansResult {
  loans: Loan[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLoans(): UseLoansResult {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function fetchLoans() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('loans')
        .select('*')
        .order('updated_at', { ascending: false });

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setLoans((data ?? []).map(dbToLoan));
      setLoading(false);
    }

    fetchLoans();

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { loans, loading, error, refetch };
}
