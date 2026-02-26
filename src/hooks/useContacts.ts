'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, dbToContact } from '@/lib/supabase';
import type { Contact } from '@/types';

interface UseContactsResult {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useContacts(): UseContactsResult {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function fetchContacts() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('contacts')
        .select('*')
        .order('name', { ascending: true });

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setContacts((data ?? []).map(dbToContact));
      setLoading(false);
    }

    fetchContacts();

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { contacts, loading, error, refetch };
}
