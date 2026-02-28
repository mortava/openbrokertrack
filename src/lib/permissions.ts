import type { UserRole } from '@/types/roles';

export type Permission =
  | 'loans:view_all'       // See all loans in system
  | 'loans:view_company'   // See all loans for their company
  | 'loans:view_assigned'  // See only loans assigned to them
  | 'loans:create'         // Create new loans
  | 'loans:edit'           // Edit loan data
  | 'loans:delete'         // Delete loans
  | 'loans:change_status'  // Change loan pipeline status
  | 'loans:issue_approval' // Issue UW approvals / conditions
  | 'contacts:view'        // View contacts
  | 'contacts:create'      // Create contacts
  | 'contacts:edit'        // Edit contacts
  | 'contacts:delete'      // Delete contacts
  | 'users:view'           // View users list
  | 'users:manage'         // Add/remove/edit users
  | 'users:assign'         // Assign users to loans
  | 'reports:view'         // View reports
  | 'reports:create'       // Create custom reports
  | 'settings:view'        // View settings
  | 'settings:edit'        // Edit settings
  | 'pipeline:view'        // View pipeline
  | 'dashboard:view';      // View dashboard

const ALL_PERMISSIONS: Permission[] = [
  'loans:view_all',
  'loans:view_company',
  'loans:view_assigned',
  'loans:create',
  'loans:edit',
  'loans:delete',
  'loans:change_status',
  'loans:issue_approval',
  'contacts:view',
  'contacts:create',
  'contacts:edit',
  'contacts:delete',
  'users:view',
  'users:manage',
  'users:assign',
  'reports:view',
  'reports:create',
  'settings:view',
  'settings:edit',
  'pipeline:view',
  'dashboard:view',
];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // ── Tier 1: App Admin ─────────────────────────────────────────────────────
  global_admin: ALL_PERMISSIONS,

  // ── Tier 2: TPO / Broker ──────────────────────────────────────────────────
  tpo_admin: [
    'loans:view_company',
    'loans:create',
    'loans:edit',
    'loans:delete',
    'loans:change_status',
    'contacts:view',
    'contacts:create',
    'contacts:edit',
    'contacts:delete',
    'users:view',
    'users:manage',
    'users:assign',
    'reports:view',
    'reports:create',
    'settings:view',
    'settings:edit',
    'pipeline:view',
    'dashboard:view',
  ],

  mlo: [
    'loans:view_assigned',
    'loans:create',
    'loans:edit',
    'loans:change_status',
    'contacts:view',
    'contacts:create',
    'contacts:edit',
    'contacts:delete',
    'reports:view',
    'pipeline:view',
    'dashboard:view',
  ],

  ops_manager: [
    'loans:view_company',
    'loans:create',
    'loans:edit',
    'loans:change_status',
    'contacts:view',
    'contacts:create',
    'contacts:edit',
    'contacts:delete',
    'users:view',
    'users:assign',
    'reports:view',
    'pipeline:view',
    'dashboard:view',
  ],

  loa_processor: [
    'loans:view_assigned',
    'loans:create',
    'loans:edit',
    'loans:change_status',
    'contacts:view',
    'contacts:create',
    'contacts:edit',
    'contacts:delete',
    'reports:view',
    'pipeline:view',
    'dashboard:view',
  ],

  // ── Tier 3: Lender ────────────────────────────────────────────────────────
  lender_admin: ALL_PERMISSIONS,

  ae_sales: [
    'loans:view_all',
    'contacts:view',
    'users:view',
    'reports:view',
    'pipeline:view',
    'dashboard:view',
  ],

  account_manager: [
    'loans:view_all',
    'loans:edit',
    'loans:change_status',
    'contacts:view',
    'contacts:create',
    'contacts:edit',
    'contacts:delete',
    'reports:view',
    'pipeline:view',
    'dashboard:view',
  ],

  underwriter: [
    'loans:view_all',
    'loans:edit',
    'loans:change_status',
    'loans:issue_approval',
    'contacts:view',
    'reports:view',
    'pipeline:view',
    'dashboard:view',
  ],

  closing_funding: ALL_PERMISSIONS,
};

// ── Helper Functions ──────────────────────────────────────────────────────────

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Returns the list of nav hrefs this role is allowed to see.
 * Every role gets dashboard (/). Other items gated by their permissions.
 */
export function getVisibleNavItems(role: UserRole): string[] {
  const items: string[] = ['/'];

  if (hasPermission(role, 'pipeline:view')) {
    items.push('/pipeline');
  }
  if (hasPermission(role, 'contacts:view')) {
    items.push('/contacts');
  }
  if (hasPermission(role, 'reports:view')) {
    items.push('/reports');
  }
  if (hasPermission(role, 'settings:view')) {
    items.push('/settings');
  }

  // Marketing visible to those who can manage contacts
  if (hasPermission(role, 'contacts:view')) {
    items.push('/marketing');
  }

  // Support and Training are always visible
  items.push('/support');
  items.push('/training');

  return items;
}

/**
 * Returns how broadly this role can see loans.
 * 'all'      — global_admin, lender_admin, ae_sales, account_manager, underwriter, closing_funding
 * 'company'  — tpo_admin, ops_manager
 * 'assigned' — mlo, loa_processor
 */
export function getLoanVisibility(role: UserRole): 'all' | 'company' | 'assigned' {
  if (hasPermission(role, 'loans:view_all')) return 'all';
  if (hasPermission(role, 'loans:view_company')) return 'company';
  return 'assigned';
}
