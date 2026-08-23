import type { TaskStatus, TaskPriority } from '../../types/task';

// ─── Status Badge ──────────────────────────────────────────────────────────

// const statusConfig: Record<TaskStatus, { label: string; bg: string; text: string }> = {
//   on_track: { label: 'ON TRACK', bg: 'bg-olive-200', text: 'text-forest-800' },
//   delayed: { label: 'DELAYED', bg: 'bg-rose-200', text: 'text-rose-900' },
//   completed: { label: 'COMPLETED', bg: 'bg-cream-200', text: 'text-forest-600' },
// };

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  on_track: { label: 'ON TRACK', bg: 'bg-olive-200', text: 'text-forest-800' },
  delayed: { label: 'DELAYED', bg: 'bg-rose-200', text: 'text-rose-900' },
  completed: { label: 'COMPLETED', bg: 'bg-cream-200', text: 'text-forest-600' },
  to_do: { label: 'TO DO', bg: 'bg-gray-200', text: 'text-gray-800' },
  in_progress: { label: 'IN PROGRESS', bg: 'bg-blue-200', text: 'text-blue-800' },
  default: { label: 'STATUS', bg: 'bg-gray-100', text: 'text-gray-800' },
};

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

// export const StatusBadge = ({ status, size = 'sm', onClick }: StatusBadgeProps) => {
//   const config = statusConfig[status];
//   const sizeClasses = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[10px]';

//   return (
//     <span
//       onClick={onClick}
//       className={`${config.bg} ${config.text} ${sizeClasses} rounded-full font-bold tracking-wide inline-flex items-center gap-1 ${
//         onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
//       }`}
//     >
//       {config.label}
//     </span>
//   );
// };

export const StatusBadge = ({ status, size = 'sm', onClick }: StatusBadgeProps) => {
  // Safe lookup with a fallback to 'default' or a generic object
  const config = statusConfig[status] || statusConfig['default'] || { label: status || 'UNKNOWN', bg: 'bg-gray-100', text: 'text-gray-800' };
  const sizeClasses = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[10px]';

  return (
    <span
      onClick={onClick}
      className={`${config.bg} ${config.text} ${sizeClasses} rounded-full font-bold tracking-wide inline-flex items-center gap-1 ${
        onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
      }`}
    >
      {config.label}
    </span>
  );
};

// ─── Priority Badge ────────────────────────────────────────────────────────

const priorityConfig: Record<TaskPriority, { label: string; dotColor: string; bg: string; text: string }> = {
  high: { label: 'HIGH', dotColor: 'bg-rose-500', bg: 'bg-rose-100', text: 'text-rose-700' },
  medium: { label: 'MEDIUM', dotColor: 'bg-olive-500', bg: 'bg-olive-100', text: 'text-olive-700' },
  low: { label: 'LOW', dotColor: 'bg-cream-300', bg: 'bg-cream-200', text: 'text-forest-500' },
};

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export const PriorityBadge = ({ priority, size = 'sm', onClick }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];
  const sizeClasses = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[10px]';

  return (
    <span
      onClick={onClick}
      className={`${config.bg} ${config.text} ${sizeClasses} rounded-full font-bold tracking-wide inline-flex items-center gap-1.5 ${
        onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}></span>
      {config.label}
    </span>
  );
};
