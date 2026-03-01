'use client';

import { useEffect, useState } from 'react';
import ContactsTable from '@/components/contacts/contacts-table';
import { supabase, dbToContact } from '@/lib/supabase';
import type { Contact } from '@/types';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data) {
        setContacts(data.map(dbToContact));
      }
      setLoading(false);
    }
    fetchContacts();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-2 border-[#171717] border-t-transparent rounded-full" />
          </div>
        ) : (
          <ContactsTable contacts={contacts} />
        )}
      </div>
    </div>
  );
}
