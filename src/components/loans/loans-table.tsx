'use client';

import { useState, useMemo } from 'react';
import { Loan } from '@/types';
import { StageBadge, TypeBadge } from '@/components/ui/badge';
import { formatCurrency, formatDate, formatPhone } from '@/lib/utils';
import { Search, Filter, ArrowUpDown, ChevronDown } from 'lucide-react';

interface LoansTableProps {
  loans: Loan[];
}

export default function LoansTable({ loans }: LoansTableProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'updatedAt' | 'loanAmount' | 'borrowerName' | 'creditScore'>('updatedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    let result = [...loans];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.borrowerName.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q) ||
          l.propertyCity.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'updatedAt') {
        cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortField === 'loanAmount') {
        cmp = a.loanAmount - b.loanAmount;
      } else if (sortField === 'borrowerName') {
        cmp = a.borrowerName.localeCompare(b.borrowerName);
      } else if (sortField === 'creditScore') {
        cmp = a.creditScore - b.creditScore;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [loans, search, sortField, sortDir, statusFilter]);

  function toggleSort(field: typeof sortField) {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  const SortHeader = ({ field, children }: { field: typeof sortField; children: React.ReactNode }) => (
    <button
      onClick={() => toggleSort(field)}
      className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
    >
      {children}
      <ArrowUpDown size={12} className={sortField === field ? 'text-[#171717]' : 'text-gray-300'} />
    </button>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID, city, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]/30"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10 cursor-pointer"
          >
            <option value="all">All Stages</option>
            <option value="lead">Lead</option>
            <option value="application">Application</option>
            <option value="processing">Processing</option>
            <option value="underwriting">Underwriting</option>
            <option value="approved">Approved</option>
            <option value="clear-to-close">Clear to Close</option>
            <option value="funded">Funded</option>
            <option value="dead">Dead</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <span className="text-xs text-gray-400 ml-auto">
          {filtered.length} loan{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3">
                <SortHeader field="borrowerName">Borrower</SortHeader>
              </th>
              <th className="text-left px-4 py-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</span>
              </th>
              <th className="text-left px-4 py-3">
                <SortHeader field="loanAmount">Amount</SortHeader>
              </th>
              <th className="text-left px-4 py-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</span>
              </th>
              <th className="text-left px-4 py-3">
                <SortHeader field="creditScore">FICO</SortHeader>
              </th>
              <th className="text-left px-4 py-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</span>
              </th>
              <th className="text-left px-4 py-3">
                <SortHeader field="updatedAt">Updated</SortHeader>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((loan) => (
              <tr
                key={loan.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{loan.borrowerName}</p>
                    <p className="text-xs text-gray-400">{loan.id} &middot; {formatPhone(loan.phone)}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm text-gray-700 truncate max-w-[200px]">{loan.propertyAddress}</p>
                    <p className="text-xs text-gray-400">{loan.propertyCity}, {loan.propertyState} {loan.propertyZip}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(loan.loanAmount)}</p>
                    <p className="text-xs text-gray-400">LTV {loan.ltv}%{loan.rate ? ` · ${loan.rate}%` : ''}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <TypeBadge variant={loan.loanType === 'nonqm' ? 'amber' : loan.loanType === 'jumbo' ? 'purple' : 'blue'}>
                      {loan.loanType.toUpperCase()}
                    </TypeBadge>
                    <span className="text-[10px] text-gray-400 capitalize">{loan.loanPurpose}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-semibold ${loan.creditScore >= 740 ? 'text-green-600' : loan.creditScore >= 700 ? 'text-amber-600' : 'text-red-600'}`}>
                    {loan.creditScore}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StageBadge stage={loan.status} />
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-500">{formatDate(loan.updatedAt)}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                  No loans found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
