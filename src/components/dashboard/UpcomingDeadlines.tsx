import { memo } from 'react';
import { CalendarClock } from 'lucide-react';
import type { DeadlineItem } from '../../types/dashboard';
import { EmptyState } from '../ui/EmptyState';
import { formatShortDate } from '../../utils/format';

interface UpcomingDeadlinesProps {
  deadlines: DeadlineItem[];
  title: string;
  emptyTitle: string;
  emptyDescription: string;
  onViewAll?: () => void;
}

export const UpcomingDeadlines = memo(
  ({ deadlines, title, emptyTitle, emptyDescription, onViewAll }: UpcomingDeadlinesProps) => {
    const getDeadlineLabel = (item: DeadlineItem): string => {
      if (item.overdue) return 'Overdue';
      if (item.daysLeft === 0) return 'Due today';
      if (item.daysLeft === 1) return 'Due tomorrow';
      return `${item.daysLeft} days left`;
    };

    return (
      <div className="space-y-2.5 card-animate" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-forest-900">{title}</h3>
          <div className="flex items-center gap-2">
            {onViewAll && (
              <button
                onClick={onViewAll}
                className="text-xs font-semibold text-forest-700 hover:text-forest-900 transition-colors cursor-pointer"
              >
                View All
              </button>
            )}
            <CalendarClock className="w-4 h-4 text-forest-700" />
          </div>
        </div>

        {deadlines.length === 0 ? (
          <div className="bg-[#fdf8e8] rounded-2xl border border-forest-900/10">
            <EmptyState type="status" title={emptyTitle} description={emptyDescription} />
          </div>
        ) : (
          <div className="space-y-2">
            {deadlines.map((item) => {
              const label = getDeadlineLabel(item);

              return (
                <div
                  key={item.id}
                  className="bg-[#fdf8e8] p-3.5 rounded-xl border border-forest-900/20 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] text-forest-900/60 font-bold mb-0.5">
                      {item.projectName}
                    </p>
                    <h4 className="text-xs font-bold text-forest-900 line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-forest-900/50 mt-1">
                      {formatShortDate(item.dueDate)}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider shrink-0 ${
                      item.overdue
                        ? 'bg-[#f2cece] border-[#e7a8a8] text-rose-900'
                        : 'bg-[#d4d9b8] border-[#b8c094] text-forest-900'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

UpcomingDeadlines.displayName = 'UpcomingDeadlines';
