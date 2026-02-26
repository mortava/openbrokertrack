'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, dbToLoan } from '@/lib/supabase';
import type { Loan } from '@/types';
import { useAuth } from '@/contexts/auth-context';

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

  const { currentUser, loanVisibility } = useAuth();

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

      const allLoans: Loan[] = (data ?? []).map(dbToLoan);

      // Apply role-based loan visibility filter
      let filtered: Loan[];

      if (loanVisibility === 'all') {
        // global_admin, lender roles — see everything
        filtered = allLoans;
      } else if (loanVisibility === 'company') {
        // tpo_admin, ops_manager — see company loans
        // No company_id on loans yet; return all as a safe default until
        // company scoping is wired up to the data model.
        filtered = allLoans;
      } else {
        // 'assigned' — mlo, loa_processor — only loans assigned to them
        const name = currentUser.fullName.toLowerCase();
        filtered = allLoans.filter((loan) => {
          const officer = (loan.loanOfficer ?? '').toLowerCase();
          const processor = (loan.processor ?? '').toLowerCase();
          const assigned = (loan.assignedTo ?? '').toLowerCase();
          return (
            officer === name ||
            processor === name ||
            assigned === name
          );
        });
      }

      setLoans(filtered);
      setLoading(false);
    }

    fetchLoans();

    return () => {
      cancelled = true;
    };
  }, [tick, loanVisibility, currentUser.fullName]);

  return { loans, loading, error, refetch };
}
