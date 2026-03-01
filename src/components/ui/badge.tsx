import { STAGE_CONFIG, PipelineStage } from '@/types';
import { cn } from '@/lib/utils';

// ─── StageBadge ───────────────────────────────────────────────────────────────

const stageClassMap: Record<PipelineStage, string> = {
  lead:            'bg-blue-50 text-blue-600 border-blue-200',
  prospect:        'bg-violet-50 text-violet-600 border-violet-200',
  application:     'bg-sky-50 text-sky-600 border-sky-200',
  processing:      'bg-amber-50 text-amber-600 border-amber-200',
  underwriting:    'bg-orange-50 text-orange-600 border-orange-200',
  approved:        'bg-emerald-50 text-emerald-600 border-emerald-200',
  'clear-to-close':'bg-teal-50 text-teal-600 border-teal-200',
  funded:          'bg-green-50 text-green-600 border-green-200',
  withdrawn:       'bg-gray-50 text-gray-600 border-gray-200',
  suspended:       'bg-yellow-50 text-yellow-600 border-yellow-200',
  dead:            'bg-red-50 text-red-600 border-red-200',
};

interface StageBadgeProps {
  stage: PipelineStage;
  size?: 'sm' | 'md';
}

export function StageBadge({ stage, size = 'sm' }: StageBadgeProps) {
  const config = STAGE_CONFIG[stage];
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap border',
        'text-xs px-2 py-0.5',
        size === 'md' && 'px-2.5 py-1',
        stageClassMap[stage]
      )}
    >
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
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  slate:   'bg-gray-100 text-gray-600 border-gray-200',
  blue:    'bg-blue-50 text-blue-700 border-blue-200',
  purple:  'bg-purple-50 text-purple-700 border-purple-200',
  amber:   'bg-amber-50 text-amber-700 border-amber-200',
  green:   'bg-green-50 text-green-700 border-green-200',
  red:     'bg-red-50 text-red-700 border-red-200',
  cyan:    'bg-cyan-50 text-cyan-700 border-cyan-200',
  orange:  'bg-orange-50 text-orange-700 border-orange-200',
  pink:    'bg-pink-50 text-pink-700 border-pink-200',
};

export function TypeBadge({ children, variant = 'default', className }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border',
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
    colorClass = 'bg-green-50 text-green-700 border-green-200';
  } else if (score >= 700) {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
  } else {
    colorClass = 'bg-red-50 text-red-700 border-red-200';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full tabular-nums border',
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
  purchase:  { label: 'Purchase',    className: 'bg-blue-50 text-blue-700 border-blue-200' },
  refinance: { label: 'Refinance',   className: 'bg-green-50 text-green-700 border-green-200' },
  cashout:   { label: 'Cash-Out',    className: 'bg-amber-50 text-amber-700 border-amber-200' },
};

export function PurposeBadge({ purpose }: PurposeBadgeProps) {
  const config = purposeConfig[purpose];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border',
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
  primary:    { label: 'Primary',    className: 'bg-gray-100 text-gray-700 border-gray-200' },
  secondary:  { label: 'Secondary',  className: 'bg-purple-50 text-purple-700 border-purple-200' },
  investment: { label: 'Investment', className: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
};

export function OccupancyBadge({ occupancy }: OccupancyBadgeProps) {
  const config = occupancyConfig[occupancy];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border',
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
  conventional: { label: 'Conv',   className: 'bg-blue-50 text-blue-700 border-blue-200' },
  fha:          { label: 'FHA',    className: 'bg-green-50 text-green-700 border-green-200' },
  va:           { label: 'VA',     className: 'bg-purple-50 text-purple-700 border-purple-200' },
  nonqm:        { label: 'NonQM',  className: 'bg-orange-50 text-orange-700 border-orange-200' },
  jumbo:        { label: 'Jumbo',  className: 'bg-pink-50 text-pink-700 border-pink-200' },
};

export function LoanTypeBadge({ loanType }: LoanTypeBadgeProps) {
  const config = loanTypeConfig[loanType];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
