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
}

export const AssignedTasksWidget = memo(
  ({ tasks, title, emptyTitle, emptyDescription }: AssignedTasksWidgetProps) => (
    <div className="space-y-2.5 card-animate" style={{ animationDelay: '350ms' }}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-forest-900">{title}</h3>
        <UserCheck className="w-4 h-4 text-forest-700" />
      </div>

      {tasks.length === 0 ? (
        <div className="bg-[#fdf8e8] rounded-2xl border border-forest-900/10">
          <EmptyState type="empty" title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#fdf8e8] p-3.5 rounded-xl border border-forest-900/20 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <p className="text-[10px] text-forest-900/60 font-bold mb-0.5">
                  {task.projectName}
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
  )
);

AssignedTasksWidget.displayName = 'AssignedTasksWidget';
