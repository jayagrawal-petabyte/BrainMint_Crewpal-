import { ArrowLeft, FolderKanban, Plus, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ProjectStatisticsCards } from '../../components/projects/ProjectStatisticsCards';
import { useProjectStore } from '../../store/projects';
import { useTaskStore } from '../../store/tasks';

export const ProjectDetails = () => {
  const { projectId } = useParams();
  const projects = useProjectStore((state) => state.projects);
  const tasks = useTaskStore((state) => state.tasks);
  const project = projects.find((item) => item.id === projectId);
  const projectTasks = tasks.filter((task) => task.projectId === projectId);
  const totalTasks = projectTasks.length;
  const onTrack = projectTasks.filter((task) => task.status === 'on_track').length;
  const delayed = projectTasks.filter((task) => task.status === 'delayed').length;
  const completed = projectTasks.filter((task) => task.status === 'completed').length;

  if (!project) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Projects
          </Button>
        </div>

        <Card className="border-cream-300">
          <h1 className="text-xl font-bold text-forest-900">Project not found</h1>
          <p className="mt-1 text-sm text-forest-500">
            The requested project could not be found.
          </p>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-3xl font-extrabold text-forest-900">{project.name}</h1>
            {project.description && <p className="text-sm text-forest-500">{project.description}</p>}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-forest-500">
              <span>Owner: {project.owner}</span>
              {project.category && <span>Category: {project.category}</span>}
              <span className="rounded-full border border-olive-300 bg-olive-200 px-2.5 py-0.5 font-bold text-forest-800">
                {project.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
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
        <ProjectStatisticsCards
          totalTasks={totalTasks}
          onTrack={onTrack}
          delayed={delayed}
          completed={completed}
        />
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
