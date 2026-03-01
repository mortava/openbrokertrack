'use client';

import { useState } from 'react';
import {
  Building2,
  GitBranch,
  ScrollText,
  Columns,
  Plug,
  Landmark,
  LayoutList,
  Bell,
  Shield,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const SIDEBAR_ITEMS: NavItem[] = [
  { id: 'general',      label: 'General Information', icon: Building2 },
  { id: 'branches',     label: 'Branches',            icon: GitBranch },
  { id: 'rules',        label: 'Business Rules',      icon: ScrollText },
  { id: 'fields',       label: 'Custom Fields',       icon: Columns },
  { id: 'integrations', label: 'Integrations',        icon: Plug },
  { id: 'lenders',      label: 'Lenders',             icon: Landmark },
  { id: 'pipeline',     label: 'Pipeline Settings',   icon: LayoutList },
  { id: 'notifications',label: 'Notifications',       icon: Bell },
  { id: 'security',     label: 'Security',            icon: Shield },
  { id: 'users',        label: 'Users',               icon: Users },
];

// ─── General Information Panel ───────────────────────────────────────────────

function GeneralInformationPanel() {
  const fields = [
    { label: 'Company Name',    value: 'OpenBroker LOS LLC' },
    { label: 'NMLS ID',         value: '123456' },
    { label: 'Street Address',  value: '100 Main Street' },
    { label: 'City',            value: 'Fort Lauderdale' },
    { label: 'State',           value: 'FL' },
    { label: 'ZIP Code',        value: '33301' },
    { label: 'Phone',           value: '(954) 555-0100' },
    { label: 'Email',           value: 'admin@openbrokertrack.com' },
    { label: 'Website',         value: 'https://openbrokertrack.com' },
  ];

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-900">General Information</h2>
        <p className="text-xs text-gray-500 mt-0.5">Your company profile and contact details.</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {fields.map((f) => (
          <div key={f.label} className="flex items-center px-5 py-3 gap-4">
            <span className="text-xs font-medium text-gray-500 w-40 shrink-0">{f.label}</span>
            <span className="text-xs text-gray-800">{f.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button className="px-4 py-2 text-xs font-semibold text-white bg-[#171717] rounded-lg hover:bg-[#171717]/90 transition-colors">
          Edit Information
        </button>
      </div>
    </div>
  );
}

// ─── Coming Soon Panel ────────────────────────────────────────────────────────

function ComingSoonPanel({ label }: { label: string }) {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-900">{label}</h2>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-16 text-gray-400">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <span className="text-gray-300 text-xl">...</span>
        </div>
        <p className="text-sm font-medium text-gray-500">Coming Soon</p>
        <p className="text-xs text-gray-400 mt-1">This section is under construction.</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [active, setActive] = useState('general');

  const activeItem = SIDEBAR_ITEMS.find((i) => i.id === active)!;

  return (
    <div className="flex h-full overflow-hidden bg-gray-50">
      {/* Left sidebar */}
      <aside className="w-48 shrink-0 bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Settings</p>
        </div>
        <nav className="flex-1 py-2">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors',
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon
                  size={14}
                  className={cn('shrink-0', isActive ? 'text-[#171717]' : 'text-gray-400')}
                />
                <span className={cn('text-xs font-medium', isActive ? 'font-semibold' : '')}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        {active === 'general' ? (
          <GeneralInformationPanel />
        ) : (
          <ComingSoonPanel label={activeItem.label} />
        )}
      </main>
    </div>
  );
}
