import { memo } from 'react';
import { FolderKanban } from 'lucide-react';
import type { ProjectProgress } from '../../types/dashboard';
import { EmptyState } from '../ui/EmptyState';

interface ProjectProgressWidgetProps {
  projects: ProjectProgress[];
  title: string;
  emptyTitle: string;
  emptyDescription: string;
}

export const ProjectProgressWidget = memo(
  ({ projects, title, emptyTitle, emptyDescription }: ProjectProgressWidgetProps) => (
    <div className="space-y-2.5 card-animate" style={{ animationDelay: '500ms' }}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-forest-900">{title}</h3>
        <FolderKanban className="w-4 h-4 text-forest-700" />
      </div>

      {projects.length === 0 ? (
        <div className="bg-[#fdf8e8] rounded-2xl border border-forest-900/10">
          <EmptyState type="empty" title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <div className="bg-[#fdf8e8] rounded-2xl border border-forest-900/10 p-3.5 space-y-3">
          {projects.map((project) => {
            const overall = Math.round(
              (project.frontend + project.backend + project.cyberChecks) / 3
            );

            return (
              <div key={project.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-bold text-forest-900 truncate">
                    {project.name}
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
                    Frontend {project.frontend}%
                  </span>
                  <span className="text-[9px] text-forest-900/50">
                    Backend {project.backend}%
                  </span>
                  <span className="text-[9px] text-forest-900/50">
                    Checks {project.cyberChecks}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
);

ProjectProgressWidget.displayName = 'ProjectProgressWidget';
