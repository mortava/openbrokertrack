'use client';

import React, { createContext, useContext, useState } from 'react';
import type { AppUser, UserRole } from '@/types/roles';
import { ROLE_TIER_MAP } from '@/types/roles';
import {
  ROLE_PERMISSIONS,
  getLoanVisibility,
  hasPermission,
  hasAnyPermission,
} from '@/lib/permissions';
import type { Permission } from '@/lib/permissions';

// ── Default / Seed Users ──────────────────────────────────────────────────────

const DEFAULT_USER: AppUser = {
  id: 'user-global-admin',
  email: 'admin@openbrokertrack.com',
  fullName: 'James Torres',
  role: 'global_admin',
  tier: 'app_admin',
  companyId: null,
  companyName: 'OpenBroker LOS',
  isActive: true,
  avatarInitials: 'JT',
  createdAt: '2024-01-01T00:00:00Z',
};

export const DEMO_USERS: AppUser[] = [
  DEFAULT_USER,
  {
    id: 'user-tpo-admin',
    email: 'maria.santos@westsiderealty.com',
    fullName: 'Maria Santos',
    role: 'tpo_admin',
    tier: 'tpo_broker',
    companyId: 'company-westside',
    companyName: 'Westside Realty Lending',
    isActive: true,
    avatarInitials: 'MS',
    createdAt: '2024-02-15T00:00:00Z',
  },
  {
    id: 'user-mlo',
    email: 'derek.chen@westsiderealty.com',
    fullName: 'Derek Chen',
    role: 'mlo',
    tier: 'tpo_broker',
    companyId: 'company-westside',
    companyName: 'Westside Realty Lending',
    isActive: true,
    avatarInitials: 'DC',
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'user-ops-manager',
    email: 'linda.park@westsiderealty.com',
    fullName: 'Linda Park',
    role: 'ops_manager',
    tier: 'tpo_broker',
    companyId: 'company-westside',
    companyName: 'Westside Realty Lending',
    isActive: true,
    avatarInitials: 'LP',
    createdAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 'user-loa-processor',
    email: 'carlos.ruiz@westsiderealty.com',
    fullName: 'Carlos Ruiz',
    role: 'loa_processor',
    tier: 'tpo_broker',
    companyId: 'company-westside',
    companyName: 'Westside Realty Lending',
    isActive: true,
    avatarInitials: 'CR',
    createdAt: '2024-03-20T00:00:00Z',
  },
  {
    id: 'user-lender-admin',
    email: 'patricia.wells@defycapital.com',
    fullName: 'Patricia Wells',
    role: 'lender_admin',
    tier: 'lender',
    companyId: 'company-defy',
    companyName: 'Defy Capital',
    isActive: true,
    avatarInitials: 'PW',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'user-ae-sales',
    email: 'brandon.hayes@defycapital.com',
    fullName: 'Brandon Hayes',
    role: 'ae_sales',
    tier: 'lender',
    companyId: 'company-defy',
    companyName: 'Defy Capital',
    isActive: true,
    avatarInitials: 'BH',
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'user-account-manager',
    email: 'sarah.kim@defycapital.com',
    fullName: 'Sarah Kim',
    role: 'account_manager',
    tier: 'lender',
    companyId: 'company-defy',
    companyName: 'Defy Capital',
    isActive: true,
    avatarInitials: 'SK',
    createdAt: '2024-02-10T00:00:00Z',
  },
  {
    id: 'user-underwriter',
    email: 'michael.okonkwo@defycapital.com',
    fullName: 'Michael Okonkwo',
    role: 'underwriter',
    tier: 'lender',
    companyId: 'company-defy',
    companyName: 'Defy Capital',
    isActive: true,
    avatarInitials: 'MO',
    createdAt: '2024-02-20T00:00:00Z',
  },
  {
    id: 'user-closing-funding',
    email: 'rachel.novak@defycapital.com',
    fullName: 'Rachel Novak',
    role: 'closing_funding',
    tier: 'lender',
    companyId: 'company-defy',
    companyName: 'Defy Capital',
    isActive: true,
    avatarInitials: 'RN',
    createdAt: '2024-03-05T00:00:00Z',
  },
];

// ── Context Shape ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  currentUser: AppUser;
  permissions: Permission[];
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  loanVisibility: 'all' | 'company' | 'assigned';
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser>(DEFAULT_USER);

  const permissions = ROLE_PERMISSIONS[currentUser.role];
  const loanVisibility = getLoanVisibility(currentUser.role);

  function can(permission: Permission): boolean {
    return hasPermission(currentUser.role, permission);
  }

  function canAny(perms: Permission[]): boolean {
    return hasAnyPermission(currentUser.role, perms);
  }

  function switchRole(role: UserRole) {
    const demoUser = DEMO_USERS.find((u) => u.role === role);
    if (demoUser) {
      setCurrentUser({ ...demoUser, tier: ROLE_TIER_MAP[role] });
    }
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, permissions, can, canAny, loanVisibility, switchRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
