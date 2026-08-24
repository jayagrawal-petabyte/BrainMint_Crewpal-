import { memo } from 'react';
import { FolderKanban } from 'lucide-react';
import type { ProjectProgress } from '../../types/dashboard';
import { EmptyState } from '../ui/EmptyState';

interface ProjectProgressWidgetProps {
  projects: ProjectProgress[];
  title: string;
  emptyTitle: string;
  emptyDescription: string;
  onViewAll?: () => void;
}

export const ProjectProgressWidget = memo(
  ({ projects = [], title, emptyTitle, emptyDescription, onViewAll }: ProjectProgressWidgetProps) => {
    const list = Array.isArray(projects) ? projects : [];

    return (
      <div className="space-y-2.5 card-animate" style={{ animationDelay: '500ms' }}>
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
            <FolderKanban className="w-4 h-4 text-forest-700" />
          </div>
        </div>

        {list.length === 0 ? (
          <div className="bg-[#fdf8e8] rounded-2xl border border-forest-900/10">
            <EmptyState type="empty" title={emptyTitle} description={emptyDescription} />
          </div>
        ) : (
          <div className="bg-[#fdf8e8] rounded-2xl border border-forest-900/10 p-3.5 space-y-3">
            {list.map((project) => {
              const fe = Number(project.frontend) || 0;
              const be = Number(project.backend) || 0;
              const cc = Number(project.cyberChecks) || 0;
              const overall = Math.min(100, Math.max(0, Math.round((fe + be + cc) / 3)));

              return (
                <div key={project.id || project.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-bold text-forest-900 truncate">
                      {project.name || 'Untitled Project'}
                    </p>
                    <span className="text-[10px] font-bold text-forest-900/60">
                      {overall}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-cream-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1e3624] transition-all duration-1000"
                      style={{ width: `${overall}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[9px] text-forest-900/50">
                      Frontend {fe}%
                    </span>
                    <span className="text-[9px] text-forest-900/50">
                      Backend {be}%
                    </span>
                    <span className="text-[9px] text-forest-900/50">
                      Checks {cc}%
                    </span>
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

ProjectProgressWidget.displayName = 'ProjectProgressWidget';
