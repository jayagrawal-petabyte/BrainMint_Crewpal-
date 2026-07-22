import { Plus, Calendar, Pin, Flag, MoreHorizontal } from 'lucide-react';
import type { Task } from '../../types/task';

// ─── Assignee Avatars ──────────────────────────────────────────────────────

export const AssigneeAvatars = ({ assignees }: { assignees: Task['assignees'] }) => (
  <div className="flex -space-x-2">
    {assignees.slice(0, 4).map((a) => (
      <div
        key={a.id}
        title={a.name}
        className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-forest-800 ${a.avatarColor ?? 'bg-olive-300'}`}
      >
        {a.initials}
      </div>
    ))}
    {assignees.length > 4 && (
      <div className="w-7 h-7 rounded-full border-2 border-white bg-cream-200 flex items-center justify-center text-[10px] font-bold text-forest-600">
        +{assignees.length - 4}
      </div>
    )}
  </div>
);

// ─── Priority Indicator ────────────────────────────────────────────────────

const priorityConfig = {
  high: { label: 'High', dotColor: 'bg-rose-500', textColor: 'text-rose-700' },
  medium: { label: 'Medium', dotColor: 'bg-olive-500', textColor: 'text-olive-700' },
  low: { label: 'Low', dotColor: 'bg-cream-300', textColor: 'text-forest-400' },
};

// ─── Task Card ─────────────────────────────────────────────────────────────

export interface TaskCardProps {
  task: Task;
  cardBorder: string;
  onClickCard?: (taskId: string) => void;
  onClickMore?: (taskId: string) => void;
}

export const TaskCard = ({ task, cardBorder, onClickCard, onClickMore }: TaskCardProps) => {
  const priority = priorityConfig[task.priority];

  // Format due date
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && task.status !== 'completed';
  const formattedDate = dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div
      onClick={() => onClickCard?.(task.id)}
      className={`bg-cream-50 rounded-xl border ${cardBorder} p-4 space-y-3 cursor-pointer
        hover:shadow-md hover:scale-[1.01] hover:border-forest-300
        active:scale-[0.99]
        transition-all duration-200 ease-out`}
    >
      {/* Top row: Tech Tag + Priority */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-forest-500">{task.techTag}</p>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${priority.dotColor}`}></span>
          <span className={`text-[10px] font-semibold ${priority.textColor}`}>{priority.label}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-forest-900 leading-snug">{task.title}</h3>

      {/* Assignee Avatars + Due Date */}
      <div className="flex items-center justify-between">
        <AssigneeAvatars assignees={task.assignees} />
        <span className={`text-[11px] font-medium ${isOverdue ? 'text-rose-600' : 'text-forest-400'}`}>
          📅 {formattedDate}
        </span>
      </div>

      {/* Action Icons Row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-4 text-forest-400">
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="hover:text-forest-700 transition-colors"
            title="Add subtask"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="hover:text-forest-700 transition-colors"
            title="Set due date"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="hover:text-forest-700 transition-colors"
            title="Pin task"
          >
            <Pin className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="hover:text-forest-700 transition-colors"
            title="Set priority"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClickMore?.(task.id);
          }}
          className="hover:text-forest-700 transition-colors text-forest-400"
          title="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
