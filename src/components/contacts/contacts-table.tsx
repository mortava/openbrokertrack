'use client';

import { useState, useMemo } from 'react';
import { Contact } from '@/types';
import { TypeBadge } from '@/components/ui/badge';
import { formatPhone, formatDate, getInitials } from '@/lib/utils';
import { Search, Mail, Phone } from 'lucide-react';

interface ContactsTableProps {
  contacts: Contact[];
}

const typeVariant: Record<string, 'default' | 'blue' | 'purple' | 'amber' | 'green'> = {
  borrower: 'blue',
  realtor: 'green',
  attorney: 'purple',
  title: 'amber',
  other: 'default',
};

export default function ContactsTable({ contacts }: ContactsTableProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    let result = [...contacts];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.company && c.company.toLowerCase().includes(q))
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter((c) => c.type === typeFilter);
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts, search, typeFilter]);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]/30"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10 cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="borrower">Borrowers</option>
          <option value="realtor">Realtors</option>
          <option value="attorney">Attorneys</option>
          <option value="title">Title</option>
          <option value="other">Other</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">
          {filtered.length} contact{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filtered.map((contact) => (
          <div
            key={contact.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700 shrink-0">
                {getInitials(contact.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {contact.name}
                  </p>
                  <TypeBadge variant={typeVariant[contact.type]}>
                    {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
                  </TypeBadge>
                </div>
                {contact.company && (
                  <p className="text-xs text-gray-500 mt-0.5">{contact.company}</p>
                )}
              </div>
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Mail size={12} className="text-gray-400" />
                <span className="truncate">{contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Phone size={12} className="text-gray-400" />
                <span>{formatPhone(contact.phone)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
              <span className="text-[10px] text-gray-400">
                {contact.loans.length} loan{contact.loans.length !== 1 ? 's' : ''}
              </span>
              <span className="text-[10px] text-gray-400">
                Added {formatDate(contact.createdAt)}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-sm text-gray-400">
            No contacts found.
          </div>
        )}
      </div>
    </div>
  );
}
