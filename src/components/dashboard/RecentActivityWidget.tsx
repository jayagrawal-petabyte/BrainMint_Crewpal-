import { memo } from 'react';
import { Activity as ActivityIcon } from 'lucide-react';
import type { DashboardActivity } from '../../types/dashboard';
import { EmptyState } from '../ui/EmptyState';
import { formatRelativeTime } from '../../utils/format';

interface RecentActivityWidgetProps {
  activities: DashboardActivity[];
  title: string;
  emptyTitle: string;
  emptyDescription: string;
}

export const RecentActivityWidget = memo(
  ({ activities = [], title, emptyTitle, emptyDescription }: RecentActivityWidgetProps) => {
    const list = Array.isArray(activities) ? activities : [];

    return (
      <div className="space-y-2.5 card-animate" style={{ animationDelay: '450ms' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-forest-900">{title}</h3>
          <ActivityIcon className="w-4 h-4 text-forest-700" />
        </div>

        {list.length === 0 ? (
          <div className="bg-[#fdf8e8] rounded-2xl border border-forest-900/10">
            <EmptyState type="empty" title={emptyTitle} description={emptyDescription} />
          </div>
        ) : (
          <div className="bg-[#fdf8e8] rounded-2xl border border-forest-900/10 p-3 space-y-3">
            {list.map((event) => {
              const initials = (event.actorInitials || event.actorName || 'U').slice(0, 2).toUpperCase();
              return (
                <div key={event.id || Math.random().toString()} className="flex gap-2.5">
                  <div className="w-7 h-7 shrink-0 rounded-full bg-[#d4d9b8] border border-[#b8c094] flex items-center justify-center text-[9px] font-bold text-forest-900">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-forest-900 truncate">
                        {event.actorName || 'Team Member'}
                      </span>
                      <span className="text-[10px] text-forest-900/50 shrink-0">
                        {formatRelativeTime(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-forest-900/80 leading-snug mt-0.5">
                      {event.message || 'Updated a task'}
                    </p>
                    {event.taskTitle && (
                      <p className="text-[10px] text-forest-900/50 italic truncate">
                        {event.taskTitle}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

RecentActivityWidget.displayName = 'RecentActivityWidget';
