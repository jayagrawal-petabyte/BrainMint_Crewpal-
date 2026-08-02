import { ArrowLeft, FolderKanban, Plus, Users } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const ProjectDetails = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Projects
        </Button>
      </div>

      <Card className="border-olive-200">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-olive-200 text-forest-800">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-forest-500">Project Header</p>
            <h1 className="text-3xl font-extrabold text-forest-900">Project Name</h1>
            <p className="text-sm text-forest-500">
              Project description and ownership details will appear here.
            </p>
          </div>
        </div>
      </Card>

      <section className="space-y-3" aria-labelledby="project-statistics-heading">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-forest-500">Overview</p>
          <h2 id="project-statistics-heading" className="text-xl font-bold text-forest-900">
            Project Statistics
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {['Total Tasks', 'On Track', 'Delayed', 'Completed'].map((label) => (
            <Card key={label} className="border-cream-300">
              <p className="text-xs font-semibold uppercase tracking-wide text-forest-500">{label}</p>
              <p className="mt-3 text-3xl font-extrabold text-forest-900">--</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="project-members-heading">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-forest-500">Collaboration</p>
            <h2 id="project-members-heading" className="text-xl font-bold text-forest-900">
              Project Members
            </h2>
          </div>
          <Button variant="secondary" size="sm" leftIcon={<Users className="w-4 h-4" />}>
            Manage Members
          </Button>
        </div>
        <Card className="border-cream-300">
          <p className="text-sm text-forest-500">Project members will appear here.</p>
        </Card>
      </section>

      <section className="space-y-3" aria-labelledby="linked-tasks-heading">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-forest-500">Work</p>
            <h2 id="linked-tasks-heading" className="text-xl font-bold text-forest-900">
              Linked Tasks
            </h2>
          </div>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Link Task
          </Button>
        </div>
        <Card className="border-cream-300">
          <p className="text-sm text-forest-500">Tasks linked to this project will appear here.</p>
        </Card>
      </section>
    </div>
  );
};
