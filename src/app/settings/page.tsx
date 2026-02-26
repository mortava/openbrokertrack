'use client';

import Header from '@/components/header';
import { User, Building2, Bell, Palette, Database, Shield } from 'lucide-react';

const sections = [
  { icon: User, label: 'Profile', desc: 'Your name, email, and account details' },
  { icon: Building2, label: 'Organization', desc: 'Company info, team members, and roles' },
  { icon: Bell, label: 'Notifications', desc: 'Email alerts and pipeline stage notifications' },
  { icon: Palette, label: 'Appearance', desc: 'Theme, branding, and display preferences' },
  { icon: Database, label: 'Integrations', desc: 'Connect your LOS, CRM, and pricing engines' },
  { icon: Shield, label: 'Security', desc: 'Password, 2FA, and session management' },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" subtitle="Manage your workspace" />
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.label}
                className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 hover:shadow-sm transition-shadow cursor-pointer"
              >
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    {section.label}
                  </p>
                  <p className="text-[10px] text-slate-500">{section.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
