'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  GitBranch,
  Users,
  FileBarChart,
  Settings,
  HelpCircle,
  GraduationCap,
  Search,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/',          label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pipeline',  label: 'Pipeline',  icon: GitBranch },
  { href: '/contacts',  label: 'Contacts',  icon: Users },
  { href: '/reports',   label: 'Reports',   icon: FileBarChart },
  { href: '/settings',  label: 'Settings',  icon: Settings },
  { href: '/support',   label: 'Support',   icon: HelpCircle },
  { href: '/training',  label: 'Training',  icon: GraduationCap },
];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Top navigation bar */}
      <nav className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-50">
        {/* Left: Logo + nav links */}
        <div className="flex items-center gap-1 h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-3 shrink-0">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-[10px] tracking-tight leading-none">OBT</span>
            </div>
            <span className="font-semibold text-slate-800 text-sm hidden md:block whitespace-nowrap">
              OpenBrokerTrack
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center h-full">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-1.5 px-3 h-full text-xs font-medium transition-colors whitespace-nowrap',
                    isActive
                      ? 'text-blue-600'
                      : 'text-slate-500 hover:text-slate-800'
                  )}
                >
                  <Icon size={14} className="shrink-0" />
                  <span className="hidden lg:block">{item.label}</span>
                  {/* Active underline indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Search, bell, avatar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search..."
              className="pl-7 pr-3 py-1 text-xs border border-slate-200 rounded-md w-40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-slate-50 placeholder:text-slate-400"
            />
          </div>

          {/* Notification bell */}
          <button
            className="relative p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-md hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          {/* User avatar */}
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-semibold cursor-pointer hover:bg-blue-700 transition-colors shrink-0">
            JT
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
