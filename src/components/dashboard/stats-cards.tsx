'use client';

import { TrendingUp, DollarSign, FileText, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Loan, PIPELINE_STAGES } from '@/types';

interface StatsCardsProps {
  loans: Loan[];
}

export default function StatsCards({ loans }: StatsCardsProps) {
  const activeLoans = loans.filter((l) => l.status !== 'funded' && l.status !== 'dead');
  const totalVolume = activeLoans.reduce((sum, l) => sum + l.loanAmount, 0);
  const fundedLoans = loans.filter((l) => l.status === 'funded');
  const fundedVolume = fundedLoans.reduce((sum, l) => sum + l.loanAmount, 0);
  const avgDaysInPipeline = 18;

  const stats = [
    {
      label: 'Active Pipeline',
      value: activeLoans.length.toString(),
      subtitle: `${PIPELINE_STAGES.length} stages`,
      icon: FileText,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Pipeline Volume',
      value: formatCurrency(totalVolume),
      subtitle: `${activeLoans.length} active loans`,
      icon: DollarSign,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Funded (MTD)',
      value: formatCurrency(fundedVolume),
      subtitle: `${fundedLoans.length} loans closed`,
      icon: TrendingUp,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Avg Days in Pipeline',
      value: `${avgDaysInPipeline}`,
      subtitle: 'Lead to funded',
      icon: Clock,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 p-3.5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider truncate">
                  {stat.label}
                </p>
                <p className="text-lg font-bold text-slate-900 mt-0.5 truncate">
                  {stat.value}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{stat.subtitle}</p>
              </div>
              <div
                className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center shrink-0 ml-2`}
              >
                <Icon size={16} className={stat.iconColor} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
