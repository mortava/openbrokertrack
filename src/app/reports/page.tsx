'use client';

import { useState } from 'react';
import { Eye, Download, Upload, Search } from 'lucide-react';

interface ReportItem {
  id: string;
  name: string;
  type: 'system' | 'company';
  description: string;
}

const ALL_REPORTS: ReportItem[] = [
  {
    id: '10day',
    name: '10-Day Report',
    type: 'system',
    description: 'Loans with LE date, intent to proceed date, and related milestone tracking.',
  },
  {
    id: '3day',
    name: '3-Day Report',
    type: 'system',
    description: 'Loans with Application Taken date and no LE issued within required timeframe.',
  },
  {
    id: '30day',
    name: '30-Day Report',
    type: 'system',
    description: 'Loans with application date but without credit decision after 30 days.',
  },
  {
    id: 'active-pipeline',
    name: 'Active Pipeline',
    type: 'company',
    description: 'Active loan status and progress of disclosures across the full pipeline.',
  },
  {
    id: 'approved-pipeline',
    name: 'Approved Loans in Pipeline',
    type: 'company',
    description: 'Approved loans with Estimated Closing Dates and outstanding conditions.',
  },
  {
    id: 'broker-lender-fee',
    name: 'Broker/Lender Fee Report',
    type: 'system',
    description: 'Assists with broker fees collected during closing and compensation tracking.',
  },
  {
    id: 'campaign',
    name: 'Campaign Report',
    type: 'system',
    description: 'Loan info associated with specific marketing campaigns and lead sources.',
  },
  {
    id: 'commission',
    name: 'Commission Report',
    type: 'system',
    description: 'Closed loans with compensation information and LO commission breakdowns.',
  },
  {
    id: 'funding-history',
    name: 'Funding History',
    type: 'company',
    description: 'Closed loans within a specified time period with volume totals.',
  },
  {
    id: 'lo-production',
    name: 'Loan Officer Production',
    type: 'company',
    description: 'LO production summary with loan counts, volume, and close rates.',
  },
  {
    id: 'lock-expiration',
    name: 'Lock Expiration',
    type: 'company',
    description: 'Lock status and expiration tracking for rate-locked loans in pipeline.',
  },
];

export default function ReportsPage() {
  const [search, setSearch] = useState('');

  const filtered = ALL_REPORTS.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
      <div className="p-5 space-y-5">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Reports</h1>
            <p className="text-xs text-slate-500 mt-0.5">Generate and export pipeline reports</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Upload size={13} />
              Export Queue
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <Download size={13} />
              Manage Reports
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-slate-400"
          />
        </div>

        {/* Reports list */}
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No reports match your search
            </div>
          ) : (
            filtered.map((report) => (
              <div
                key={report.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors group"
              >
                {/* View icon */}
                <button
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                  title="View report"
                >
                  <Eye size={14} />
                </button>

                {/* Report info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {report.name}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wide ${
                        report.type === 'system'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {report.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{report.description}</p>
                </div>

                {/* Run button */}
                <button className="shrink-0 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100">
                  Run
                </button>
              </div>
            ))
          )}
        </div>

        <p className="text-[10px] text-slate-400 text-center">
          {filtered.length} of {ALL_REPORTS.length} reports
        </p>
      </div>
    </div>
  );
}
