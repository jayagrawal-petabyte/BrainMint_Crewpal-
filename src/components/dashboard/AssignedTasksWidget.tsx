import { memo } from 'react';
import { UserCheck } from 'lucide-react';
import type { AssignedTask } from '../../types/dashboard';
import { StatusBadge } from '../ui/Badges';
import { EmptyState } from '../ui/EmptyState';
import { formatShortDate } from '../../utils/format';

interface AssignedTasksWidgetProps {
  tasks: AssignedTask[];
  title: string;
  emptyTitle: string;
  emptyDescription: string;
  onViewAll?: () => void;
}

export const AssignedTasksWidget = memo(
  ({ tasks = [], title, emptyTitle, emptyDescription, onViewAll }: AssignedTasksWidgetProps) => {
    const list = Array.isArray(tasks) ? tasks : [];

    return (
      <div className="space-y-2.5 card-animate" style={{ animationDelay: '350ms' }}>
        <div className="flex items-center justify-between group">
          <h3 
            className={`text-sm font-bold text-forest-900 ${onViewAll ? 'cursor-pointer group-hover:text-forest-700 transition-colors' : ''}`}
            onClick={onViewAll}
          >
            {title}
          </h3>
          
          {onViewAll ? (
            <button
              onClick={onViewAll}
              className="text-forest-700 hover:text-forest-900 transition-colors p-1 rounded-md hover:bg-forest-900/5 cursor-pointer flex items-center gap-1.5"
              aria-label={`View all ${title}`}
            >
              <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">View All</span>
              <UserCheck className="w-4 h-4" />
            </button>
          ) : (
            <UserCheck className="w-4 h-4 text-forest-700" />
          )}
        </div>

        {list.length === 0 ? (
          <div className="bg-[#fdf8e8] rounded-2xl border border-forest-900/10">
            <EmptyState type="empty" title={emptyTitle} description={emptyDescription} />
          </div>
        ) : (
          <div className="space-y-2">
            {list.map((task) => (
              <div
                key={task.id}
                className="bg-[#fdf8e8] p-3.5 rounded-xl border border-forest-900/20 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="text-[10px] text-forest-900/60 font-bold mb-0.5">
                    {task.projectName || 'General'}
                  </p>
                  <h4 className="text-xs font-bold text-forest-900 line-clamp-1">
                    {task.title}
                  </h4>
                  <p className="text-[10px] text-forest-900/50 mt-1">
                    {formatShortDate(task.dueDate)}
                  </p>
                </div>
                <StatusBadge status={task.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

AssignedTasksWidget.displayName = 'AssignedTasksWidget';