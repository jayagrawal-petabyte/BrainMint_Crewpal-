import { memo } from 'react';
import {
  BarChart2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import type { DashboardStatistics } from '../../types/dashboard';
import { useTranslation } from '../../hooks/useTranslation';
import { StatCard } from './StatCard';

interface StatisticsGridProps {
  statistics: DashboardStatistics;
}

export const StatisticsGrid = memo(({ statistics }: StatisticsGridProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        title={t.totalProjects}
        value={statistics.totalProjects}
        icon={<BarChart2 className="w-4 h-4" />}
        className="bg-[#d4d9b8] border-[#b8c094]"
        delay="50ms"
      />

      <StatCard
        title={t.completedTasks}
        value={statistics.completedTasks}
        icon={<CheckCircle2 className="w-4 h-4" />}
        className="bg-[#e2d3bc] border-cream-300"
        delay="100ms"
      />

      <StatCard
        title={t.pendingTasks}
        value={statistics.pendingTasks}
        icon={<Clock className="w-4 h-4" />}
        className="bg-[#fdf8e8] border-forest-900/10"
        delay="150ms"
      />

      <StatCard
        title={t.overdueTasks}
        value={statistics.overdueTasks}
        icon={<AlertTriangle className="w-4 h-4" />}
        className="bg-[#f2cece] border-rose-300"
        delay="200ms"
      />

      <div
        className="col-span-2 bg-white p-4 rounded-2xl border border-forest-900/10 shadow-sm card-animate"
        style={{ animationDelay: '250ms' }}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xs font-bold text-forest-900 opacity-70">
            {t.productivity}
          </h3>
          <TrendingUp className="w-4 h-4 text-forest-800" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 rounded-full bg-cream-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#1e3624] transition-all duration-1000"
              style={{ width: `${statistics.productivity}%` }}
            />
          </div>
          <span className="text-xl font-extrabold text-forest-900">
            {statistics.productivity}%
          </span>
        </div>
      </div>
    </div>
  );
});

StatisticsGrid.displayName = 'StatisticsGrid';
