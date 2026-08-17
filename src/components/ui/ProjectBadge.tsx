import type { ProjectStatus } from '../../types/project';

// ─── Project Status Badge ─────────────────────────────────────────────────────

const statusConfig: Record<ProjectStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  on_track: { label: 'ON TRACK', bg: 'bg-olive-100', text: 'text-olive-700', border: 'border-olive-200', dot: 'bg-olive-500' },
  delayed: { label: 'DELAYED', bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  completed: { label: 'COMPLETED', bg: 'bg-cream-100', text: 'text-forest-600', border: 'border-cream-200', dot: 'bg-forest-400' },
};

interface ProjectBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
}

export const ProjectBadge = ({ status, size = 'sm' }: ProjectBadgeProps) => {
  const config = statusConfig[status];
  const sizeClasses = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[10px]';

  return (
    <span className={`${config.bg} ${config.text} ${config.border} ${sizeClasses} rounded-full font-semibold tracking-wide inline-flex items-center gap-1.5 border`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
};
