'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
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
  Check,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { DEMO_USERS } from '@/contexts/auth-context';
import { getVisibleNavItems } from '@/lib/permissions';
import { ROLE_LABELS, TIER_LABELS, type UserRole } from '@/types/roles';
import AIAssistant from '@/components/ai-assistant';

// Full nav item definition — visibility is filtered per role below
const ALL_NAV_ITEMS = [
  { href: '/',          label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pipeline',  label: 'Pipeline',  icon: GitBranch },
  { href: '/contacts',  label: 'Contacts',  icon: Users },
  { href: '/reports',   label: 'Reports',   icon: FileBarChart },
  { href: '/settings',  label: 'Settings',  icon: Settings },
  { href: '/support',   label: 'Support',   icon: HelpCircle },
  { href: '/training',  label: 'Training',  icon: GraduationCap },
];

// Tier badge colors
const TIER_BADGE_COLORS: Record<string, string> = {
  app_admin:  'bg-violet-100 text-violet-700',
  tpo_broker: 'bg-blue-100 text-blue-700',
  lender:     'bg-emerald-100 text-emerald-700',
};

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, switchRole } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter nav items based on role permissions
  const visibleHrefs = getVisibleNavItems(currentUser.role);
  const navItems = ALL_NAV_ITEMS.filter((item) => visibleHrefs.includes(item.href));

  // Group demo users by tier for the role switcher menu
  const tiers: Array<{ key: string; label: string; roles: UserRole[] }> = [
    {
      key: 'app_admin',
      label: TIER_LABELS['app_admin'],
      roles: DEMO_USERS.filter((u) => u.tier === 'app_admin').map((u) => u.role),
    },
    {
      key: 'tpo_broker',
      label: TIER_LABELS['tpo_broker'],
      roles: DEMO_USERS.filter((u) => u.tier === 'tpo_broker').map((u) => u.role),
    },
    {
      key: 'lender',
      label: TIER_LABELS['lender'],
      roles: DEMO_USERS.filter((u) => u.tier === 'lender').map((u) => u.role),
    },
  ];

  function handleSwitchRole(role: UserRole) {
    switchRole(role);
    setDropdownOpen(false);
  }

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

        {/* Right: Search, bell, avatar + role badge */}
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

          {/* Role badge (small pill, hidden on mobile) */}
          <span
            className={cn(
              'hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold leading-none whitespace-nowrap',
              TIER_BADGE_COLORS[currentUser.tier] ?? 'bg-slate-100 text-slate-600'
            )}
          >
            {ROLE_LABELS[currentUser.role]}
          </span>

          {/* User avatar + dropdown trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="User menu"
              aria-expanded={dropdownOpen}
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-semibold hover:bg-blue-700 transition-colors shrink-0">
                {currentUser.avatarInitials}
              </div>
              <ChevronDown
                size={12}
                className={cn(
                  'text-slate-400 transition-transform duration-150',
                  dropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-[100] overflow-hidden">
                {/* User identity */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">
                    {currentUser.fullName}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {currentUser.email}
                  </p>
                  <span
                    className={cn(
                      'inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold leading-none',
                      TIER_BADGE_COLORS[currentUser.tier] ?? 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {ROLE_LABELS[currentUser.role]}
                  </span>
                </div>

                {/* Switch Role section */}
                <div className="px-3 pt-2 pb-1">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1 mb-1">
                    Switch Role (Demo)
                  </p>

                  {tiers.map((tier) => (
                    <div key={tier.key} className="mb-2">
                      {/* Tier label */}
                      <p className="text-[10px] font-medium text-slate-500 px-1 py-0.5 uppercase tracking-wide">
                        {tier.label}
                      </p>
                      {tier.roles.map((role) => (
                        <button
                          key={role}
                          onClick={() => handleSwitchRole(role)}
                          className={cn(
                            'w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-colors',
                            role === currentUser.role
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                          )}
                        >
                          <span>{ROLE_LABELS[role]}</span>
                          {role === currentUser.role && (
                            <Check size={12} className="text-blue-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* AI Assistant — floating on all pages */}
      <AIAssistant />
    </div>
  );
}
