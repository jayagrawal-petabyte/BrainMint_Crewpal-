import { useState } from 'react';
import { ArrowLeft, FolderKanban, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { LinkTasksToProjectModal } from '../../components/projects/LinkTasksToProjectModal';
import { ManageProjectMembersModal } from '../../components/projects/ManageProjectMembersModal';
import { ProjectMembersSection } from '../../components/projects/ProjectMembersSection';
import { ProjectStatisticsCards } from '../../components/projects/ProjectStatisticsCards';
import { PriorityBadge, StatusBadge } from '../../components/ui/Badges';
import { useProjectStore } from '../../store/projects';
import { MOCK_TEAM_MEMBERS, useTaskStore } from '../../store/tasks';

export const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [isLinkTasksOpen, setIsLinkTasksOpen] = useState(false);
  const projects = useProjectStore((state) => state.projects);
  const updateProjectMembers = useProjectStore((state) => state.updateProjectMembers);
  const tasks = useTaskStore((state) => state.tasks);
  const updateProjectTasks = useTaskStore((state) => state.updateProjectTasks);
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/projects')}>
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

  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const linkedTaskIds = tasks
    .filter((task) => task.projectId === project.id)
    .map((task) => task.id);
  const totalTasks = projectTasks.length;
  const onTrack = projectTasks.filter((task) => task.status === 'on_track').length;
  const delayed = projectTasks.filter((task) => task.status === 'delayed').length;
  const completed = projectTasks.filter((task) => task.status === 'completed').length;
  const projectMembers = MOCK_TEAM_MEMBERS.filter((member) => project.memberIds.includes(member.id));

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/projects')}>
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

      <ProjectMembersSection
        members={projectMembers}
        onManage={() => setIsManageMembersOpen(true)}
      />

      <section className="space-y-3" aria-labelledby="linked-tasks-heading">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-forest-500">Work</p>
            <h2 id="linked-tasks-heading" className="text-xl font-bold text-forest-900">
              Linked Tasks
            </h2>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsLinkTasksOpen(true)}
          >
            Link Task
          </Button>
        </div>
        <Card className="border-cream-300">
          {projectTasks.length === 0 ? (
            <div className="space-y-1 py-2">
              <h3 className="text-sm font-bold text-forest-900">No tasks linked yet</h3>
              <p className="text-sm text-forest-500">Use “Link Task” to assign tasks to this project.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projectTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cream-200 bg-cream-50 px-4 py-3"
                >
                  <p className="font-semibold text-forest-900">{task.title}</p>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={task.status} />
                    {task.priority && <PriorityBadge priority={task.priority} />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      <ManageProjectMembersModal
        open={isManageMembersOpen}
        members={MOCK_TEAM_MEMBERS}
        selectedMemberIds={project.memberIds}
        onClose={() => setIsManageMembersOpen(false)}
        onSave={(memberIds) => {
          updateProjectMembers(project.id, memberIds);
          setIsManageMembersOpen(false);
        }}
      />

      <LinkTasksToProjectModal
        open={isLinkTasksOpen}
        tasks={tasks}
        linkedTaskIds={linkedTaskIds}
        onClose={() => setIsLinkTasksOpen(false)}
        onSave={(selectedTaskIds) => {
          updateProjectTasks(project.id, selectedTaskIds);
          setIsLinkTasksOpen(false);
        }}
      />
    </div>
  );
};
