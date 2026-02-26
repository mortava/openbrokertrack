import { STAGE_CONFIG, PipelineStage } from '@/types';

interface StageBadgeProps {
  stage: PipelineStage;
  size?: 'sm' | 'md';
}

export function StageBadge({ stage, size = 'sm' }: StageBadgeProps) {
  const config = STAGE_CONFIG[stage];
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full whitespace-nowrap ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}

interface TypeBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'blue' | 'purple' | 'amber' | 'green';
}

const variantStyles = {
  default: 'bg-slate-100 text-slate-700',
  blue: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
  amber: 'bg-amber-50 text-amber-700',
  green: 'bg-green-50 text-green-700',
};

export function TypeBadge({ children, variant = 'default' }: TypeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
