export type UserTier = 'app_admin' | 'tpo_broker' | 'lender';

export type UserRole =
  | 'global_admin'
  | 'tpo_admin'
  | 'mlo'
  | 'ops_manager'
  | 'loa_processor'
  | 'lender_admin'
  | 'ae_sales'
  | 'account_manager'
  | 'underwriter'
  | 'closing_funding';

export interface Company {
  id: string;
  name: string;
  nmlsId?: string;
  type: 'broker' | 'lender' | 'platform';
  isActive: boolean;
  createdAt: string;
}

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  tier: UserTier;
  companyId: string | null;
  companyName?: string;
  isActive: boolean;
  avatarInitials: string;
  createdAt: string;
}

// Map roles to their tier
export const ROLE_TIER_MAP: Record<UserRole, UserTier> = {
  global_admin:    'app_admin',
  tpo_admin:       'tpo_broker',
  mlo:             'tpo_broker',
  ops_manager:     'tpo_broker',
  loa_processor:   'tpo_broker',
  lender_admin:    'lender',
  ae_sales:        'lender',
  account_manager: 'lender',
  underwriter:     'lender',
  closing_funding: 'lender',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  global_admin:    'Global Admin',
  tpo_admin:       'TPO Admin',
  mlo:             'Loan Officer (MLO)',
  ops_manager:     'Ops Manager',
  loa_processor:   'LOA / Processor',
  lender_admin:    'Lender Admin',
  ae_sales:        'AE / Sales',
  account_manager: 'Account Manager',
  underwriter:     'Underwriter',
  closing_funding: 'Closing & Funding',
};

export const TIER_LABELS: Record<UserTier, string> = {
  app_admin:  'Platform',
  tpo_broker: 'TPO / Broker',
  lender:     'Lender',
};
