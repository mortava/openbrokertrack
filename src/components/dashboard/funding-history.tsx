'use client';

import { useState, useMemo } from 'react';
import { useLoans } from '@/hooks/useLoans';
import { formatCurrency, cn } from '@/lib/utils';
import { TrendingUp, ChevronDown, Check } from 'lucide-react';

interface MonthBucket {
  key: string;    // "2026-03"
  label: string;  // "Mar 2026"
  count: number;
  volume: number;
}

function getMonthLabel(key: string): string {
  const [year, month] = key.split('-');
  const d = new Date(parseInt(year), parseInt(month) - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/** Generate month keys from March 2026 onward (current + 12 ahead), plus past months */
function generateMonthKeys(): string[] {
  const keys: string[] = [];
  // Start from March 2026 and go through 24 months of history
  const start = new Date(2024, 2, 1); // March 2024
  const end = new Date(2027, 2, 1);   // March 2027
  const d = new Date(start);
  while (d <= end) {
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    d.setMonth(d.getMonth() + 1);
  }
  return keys;
}

export default function FundingHistory() {
  const { loans, loading } = useLoans();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Default: only March 2026 (current month) selected
  const [selectedMonths, setSelectedMonths] = useState<Set<string>>(new Set(['2026-03']));

  const allMonthKeys = useMemo(() => generateMonthKeys(), []);

  const funded = useMemo(() => loans.filter((l) => l.status === 'funded'), [loans]);

  // Build all buckets
  const allBuckets = useMemo(() => {
    const bucketsMap: Record<string, MonthBucket> = {};
    allMonthKeys.forEach((key) => {
      bucketsMap[key] = { key, label: getMonthLabel(key), count: 0, volume: 0 };
    });

    funded.forEach((loan) => {
      const dateStr = loan.fundingDate ?? loan.createdAt;
      const d = new Date(dateStr);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (bucketsMap[key]) {
        bucketsMap[key].count += 1;
        bucketsMap[key].volume += loan.loanAmount;
      }
    });

    return bucketsMap;
  }, [allMonthKeys, funded]);

  // Only show months with data or selected months
  const monthsWithData = useMemo(
    () => allMonthKeys.filter((k) => allBuckets[k]?.count > 0),
    [allMonthKeys, allBuckets]
  );

  // Selectable months = months with data + always show March 2026+
  const selectableMonths = useMemo(() => {
    const set = new Set([...monthsWithData]);
    // Always include March 2026 onward
    allMonthKeys.forEach((k) => {
      if (k >= '2026-03') set.add(k);
    });
    return Array.from(set).sort().reverse();
  }, [monthsWithData, allMonthKeys]);

  function toggleMonth(key: string) {
    setSelectedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function selectAll() {
    setSelectedMonths(new Set(selectableMonths));
  }

  function clearAll() {
    setSelectedMonths(new Set(['2026-03']));
  }

  // Visible rows = selected months, newest first
  const rows = useMemo(() => {
    return Array.from(selectedMonths)
      .sort()
      .reverse()
      .map((k) => allBuckets[k])
      .filter(Boolean);
  }, [selectedMonths, allBuckets]);

  const totalCount = rows.reduce((s, r) => s + r.count, 0);
  const totalVolume = rows.reduce((s, r) => s + r.volume, 0);

  // Current month label for MTD
  const currentMonthKey = '2026-03';
  const currentBucket = allBuckets[currentMonthKey];

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-green-600" />
          <h3 className="text-sm font-semibold text-slate-900">Funding History</h3>
        </div>

        {/* Month selector dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors"
          >
            {selectedMonths.size === 1 && selectedMonths.has(currentMonthKey)
              ? 'Month to Date'
              : `${selectedMonths.size} month${selectedMonths.size !== 1 ? 's' : ''}`
            }
            <ChevronDown size={10} className={cn('transition-transform', dropdownOpen && 'rotate-180')} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
              {/* Quick actions */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Select Months</span>
                <div className="flex gap-2">
                  <button onClick={selectAll} className="text-[10px] text-blue-600 hover:text-blue-700 font-medium">All</button>
                  <button onClick={clearAll} className="text-[10px] text-slate-400 hover:text-slate-600 font-medium">Reset</button>
                </div>
              </div>

              {/* Month checkboxes */}
              <div className="max-h-56 overflow-y-auto py-1">
                {selectableMonths.map((key) => {
                  const bucket = allBuckets[key];
                  const isSelected = selectedMonths.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggleMonth(key)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors text-left',
                        isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      <div className={cn(
                        'w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0',
                        isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                      )}>
                        {isSelected && <Check size={9} className="text-white" />}
                      </div>
                      <span className="flex-1">{bucket?.label ?? getMonthLabel(key)}</span>
                      {bucket && bucket.count > 0 && (
                        <span className="text-[10px] text-green-600 font-medium">{bucket.count}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 px-3 py-2">
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-center text-[10px] font-medium text-blue-600 hover:text-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MTD Summary Card */}
      {currentBucket && (
        <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-100">
          <p className="text-[10px] font-semibold text-green-700 uppercase tracking-wider mb-1">Month to Date — March 2026</p>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xl font-bold text-green-700 tabular-nums">{currentBucket.count}</p>
              <p className="text-[10px] text-green-600">Loans Funded</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-700 tabular-nums">{formatCurrency(currentBucket.volume)}</p>
              <p className="text-[10px] text-green-600">Total Volume</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-4 space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="h-3 bg-slate-100 rounded w-16" />
              <div className="h-3 bg-slate-100 rounded w-8 ml-auto" />
              <div className="h-3 bg-slate-100 rounded w-20" />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
          <TrendingUp size={24} className="mb-2 opacity-30" />
          <p className="text-xs font-medium">No months selected</p>
          <p className="text-[10px] mt-0.5">Use the dropdown to select months to display</p>
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 sticky top-0 bg-white">
                <th className="text-left font-medium px-4 py-2">Period</th>
                <th className="text-right font-medium px-4 py-2"># Loans</th>
                <th className="text-right font-medium px-4 py-2">Total Volume</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.key}
                  className={`border-b border-slate-50 last:border-0 transition-colors ${
                    row.count > 0 ? 'hover:bg-slate-50' : ''
                  }`}
                >
                  <td className={`px-4 py-1.5 font-medium ${row.count > 0 ? 'text-slate-800' : 'text-slate-300'}`}>
                    {row.label}
                    {row.key === currentMonthKey && (
                      <span className="ml-1.5 text-[9px] font-semibold text-green-600 bg-green-50 px-1 py-0.5 rounded">MTD</span>
                    )}
                  </td>
                  <td className={`px-4 py-1.5 text-right tabular-nums font-semibold ${row.count > 0 ? 'text-slate-900' : 'text-slate-300'}`}>
                    {row.count > 0 ? row.count : '-'}
                  </td>
                  <td className={`px-4 py-1.5 text-right tabular-nums ${row.count > 0 ? 'text-green-700 font-medium' : 'text-slate-300'}`}>
                    {row.count > 0 ? formatCurrency(row.volume) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            {rows.length > 1 && (
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td className="px-4 py-2 font-bold text-slate-700">Total</td>
                  <td className="px-4 py-2 text-right font-bold text-slate-900 tabular-nums">
                    {totalCount}
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-green-700 tabular-nums">
                    {formatCurrency(totalVolume)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}
