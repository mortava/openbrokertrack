'use client';

import Header from '@/components/header';
import ContactsTable from '@/components/contacts/contacts-table';
import { mockContacts } from '@/lib/data';

export default function ContactsPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header title="Contacts" subtitle="Borrowers, realtors, and partners" />
      <div className="flex-1 overflow-y-auto p-6">
        <ContactsTable contacts={mockContacts} />
      </div>
    </div>
  );
}
