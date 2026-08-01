import React from 'react';
import { Building2, CheckCircle2, Users, Crown } from 'lucide-react';
import type { Organization } from '../../types/organization';

interface OrganizationStatsProps {
  organizations: Organization[];
}

export const OrganizationStats: React.FC<OrganizationStatsProps> = ({ organizations }) => {
  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter((o) => o.is_active).length;
  const totalMembers = organizations.reduce((acc, o) => acc + o.memberCount, 0);
  const enterpriseCount = organizations.filter((o) => o.planTier === 'Enterprise').length;

  const stats = [
    {
      title: 'Total Organizations',
      value: totalOrgs,
      subtitle: 'Managed Workspaces',
      icon: Building2,
      cardBg: 'bg-forest-800 text-cream-50 border-forest-900',
      iconBg: 'bg-forest-700/70 text-olive-300',
      valueColor: 'text-cream-50',
    },
    {
      title: 'Active Workspaces',
      value: activeOrgs,
      subtitle: `${Math.round((activeOrgs / (totalOrgs || 1)) * 100)}% active rate`,
      icon: CheckCircle2,
      cardBg: 'bg-olive-200 text-forest-900 border-olive-300',
      iconBg: 'bg-olive-300/80 text-forest-900',
      valueColor: 'text-forest-900',
    },
    {
      title: 'Total Members',
      value: totalMembers,
      subtitle: 'Across all orgs',
      icon: Users,
      cardBg: 'bg-teal-50 text-forest-900 border-teal-200',
      iconBg: 'bg-teal-200 text-teal-800',
      valueColor: 'text-teal-900',
    },
    {
      title: 'Enterprise Plan',
      value: enterpriseCount,
      subtitle: 'Tiered subscribers',
      icon: Crown,
      cardBg: 'bg-rose-100 text-forest-900 border-rose-200',
      iconBg: 'bg-rose-200 text-rose-800',
      valueColor: 'text-rose-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`p-4 md:p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-all hover:shadow-md card-animate ${stat.cardBg}`}
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-wide uppercase opacity-80">
                {stat.title}
              </p>
              <h3 className={`text-2xl md:text-3xl font-extrabold ${stat.valueColor}`}>
                {stat.value}
              </h3>
              <p className="text-[11px] font-medium opacity-75">{stat.subtitle}</p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
