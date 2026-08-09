import type { ReactNode } from 'react';
import { Clock, GitBranch, MessageSquare, CheckSquare, UserPlus, Plus, Calendar, AlertCircle } from 'lucide-react';
import { useActivityStore } from '../../store/tasks/activityStore';
import type { ActivityEventType } from '../../types/activity';

interface ActivityTimelineProps {
  taskId: string;
}

// Map each event type to icon + color
const EVENT_CONFIG: Record<
  ActivityEventType,
  { icon: ReactNode; color: string; dotColor: string }
> = {
  task_created: {
    icon: <Plus className="w-3 h-3" />,
    color: 'text-forest-700',
    dotColor: 'bg-forest-700',
  },
  status_changed: {
    icon: <GitBranch className="w-3 h-3" />,
    color: 'text-olive-700',
    dotColor: 'bg-olive-500',
  },
  priority_changed: {
    icon: <AlertCircle className="w-3 h-3" />,
    color: 'text-rose-700',
    dotColor: 'bg-rose-400',
  },
  comment_added: {
    icon: <MessageSquare className="w-3 h-3" />,
    color: 'text-teal-700',
    dotColor: 'bg-teal-500',
  },
  subtask_added: {
    icon: <CheckSquare className="w-3 h-3" />,
    color: 'text-forest-600',
    dotColor: 'bg-forest-400',
  },
  subtask_completed: {
    icon: <CheckSquare className="w-3 h-3" />,
    color: 'text-forest-700',
    dotColor: 'bg-forest-600',
  },
  assignee_added: {
    icon: <UserPlus className="w-3 h-3" />,
    color: 'text-olive-600',
    dotColor: 'bg-olive-400',
  },
  due_date_changed: {
    icon: <Calendar className="w-3 h-3" />,
    color: 'text-rose-600',
    dotColor: 'bg-rose-300',
  },
};

const formatRelativeTime = (isoString: string): string => {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export const ActivityTimeline = ({ taskId }: ActivityTimelineProps) => {
  const getTaskEvents = useActivityStore((state) => state.getTaskEvents);
  const events = getTaskEvents(taskId);

  if (events.length === 0) {
    return (
      <div className="py-6 text-center space-y-1">
        <Clock className="w-6 h-6 text-forest-300 mx-auto" />
        <p className="text-xs text-forest-400 italic">No activity yet on this task.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-0">
      {/* Vertical connecting line */}
      <div className="absolute left-[11px] top-3 bottom-3 w-px bg-forest-900/10 z-0" />

      {events.map((event, index) => {
        const config = EVENT_CONFIG[event.type] ?? EVENT_CONFIG['task_created'];
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className={`relative flex gap-3 ${isLast ? '' : 'pb-4'}`}>
            {/* Timeline dot + icon */}
            <div className="relative z-10 shrink-0 flex flex-col items-center">
              <div
                className={`w-5 h-5 rounded-full ${config.dotColor} flex items-center justify-center text-white shadow-sm`}
              >
                {config.icon}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Actor avatar */}
                  <span className="w-4 h-4 rounded-full bg-olive-200 text-forest-800 text-[8px] font-bold flex items-center justify-center shrink-0">
                    {event.actorInitials.slice(0, 2)}
                  </span>
                  <span className="text-[11px] font-bold text-forest-900">{event.actorName}</span>
                </div>
                <span className="text-[10px] text-forest-400 shrink-0 mt-0.5">
                  {formatRelativeTime(event.timestamp)}
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 leading-snug ${config.color}`}>
                {event.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
