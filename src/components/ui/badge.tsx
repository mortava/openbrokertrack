import { STAGE_CONFIG, PipelineStage } from '@/types';
import { cn } from '@/lib/utils';

// ─── StageBadge ───────────────────────────────────────────────────────────────

interface StageBadgeProps {
  stage: PipelineStage;
  size?: 'sm' | 'md';
}

export function StageBadge({ stage, size = 'sm' }: StageBadgeProps) {
  const config = STAGE_CONFIG[stage];
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
      style={{ color: config.color, backgroundColor: config.bgColor }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}

// ─── TypeBadge ────────────────────────────────────────────────────────────────

type BadgeVariant =
  | 'default'
  | 'blue'
  | 'purple'
  | 'amber'
  | 'green'
  | 'red'
  | 'cyan'
  | 'slate'
  | 'orange'
  | 'pink';

interface TypeBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  slate:   'bg-slate-100 text-slate-600',
  blue:    'bg-blue-50 text-blue-700',
  purple:  'bg-purple-50 text-purple-700',
  amber:   'bg-amber-50 text-amber-700',
  green:   'bg-green-50 text-green-700',
  red:     'bg-red-50 text-red-700',
  cyan:    'bg-cyan-50 text-cyan-700',
  orange:  'bg-orange-50 text-orange-700',
  pink:    'bg-pink-50 text-pink-700',
};

export function TypeBadge({ children, variant = 'default', className }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── CreditScoreBadge ─────────────────────────────────────────────────────────

interface CreditScoreBadgeProps {
  score: number;
}

export function CreditScoreBadge({ score }: CreditScoreBadgeProps) {
  let colorClass: string;
  if (score >= 740) {
    colorClass = 'bg-green-50 text-green-700';
  } else if (score >= 700) {
    colorClass = 'bg-amber-50 text-amber-700';
  } else {
    colorClass = 'bg-red-50 text-red-700';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full tabular-nums',
        colorClass
      )}
    >
      {score}
    </span>
  );
}

// ─── PurposeBadge ─────────────────────────────────────────────────────────────

type LoanPurpose = 'purchase' | 'refinance' | 'cashout';

interface PurposeBadgeProps {
  purpose: LoanPurpose;
}

const purposeConfig: Record<LoanPurpose, { label: string; className: string }> = {
  purchase:  { label: 'Purchase',    className: 'bg-blue-50 text-blue-700' },
  refinance: { label: 'Refinance',   className: 'bg-green-50 text-green-700' },
  cashout:   { label: 'Cash-Out',    className: 'bg-amber-50 text-amber-700' },
};

export function PurposeBadge({ purpose }: PurposeBadgeProps) {
  const config = purposeConfig[purpose];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

// ─── OccupancyBadge ───────────────────────────────────────────────────────────

type OccupancyType = 'primary' | 'secondary' | 'investment';

interface OccupancyBadgeProps {
  occupancy: OccupancyType;
}

const occupancyConfig: Record<OccupancyType, { label: string; className: string }> = {
  primary:    { label: 'Primary',    className: 'bg-slate-100 text-slate-700' },
  secondary:  { label: 'Secondary',  className: 'bg-purple-50 text-purple-700' },
  investment: { label: 'Investment', className: 'bg-cyan-50 text-cyan-700' },
};

export function OccupancyBadge({ occupancy }: OccupancyBadgeProps) {
  const config = occupancyConfig[occupancy];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

// ─── LoanTypeBadge ────────────────────────────────────────────────────────────

type LoanType = 'conventional' | 'fha' | 'va' | 'nonqm' | 'jumbo';

interface LoanTypeBadgeProps {
  loanType: LoanType;
}

const loanTypeConfig: Record<LoanType, { label: string; className: string }> = {
  conventional: { label: 'Conv',   className: 'bg-blue-50 text-blue-700' },
  fha:          { label: 'FHA',    className: 'bg-green-50 text-green-700' },
  va:           { label: 'VA',     className: 'bg-purple-50 text-purple-700' },
  nonqm:        { label: 'NonQM',  className: 'bg-orange-50 text-orange-700' },
  jumbo:        { label: 'Jumbo',  className: 'bg-pink-50 text-pink-700' },
};

export function LoanTypeBadge({ loanType }: LoanTypeBadgeProps) {
  const config = loanTypeConfig[loanType];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
