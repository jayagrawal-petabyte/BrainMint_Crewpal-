import type { ActivityEvent } from '../types/activity';
import type { Project } from '../types/project';
import type { Task } from '../types/task';
import type {
  DashboardData,
  DashboardUser,
  QuickAction,
  ScheduleItem,
} from '../types/dashboard';
import { statisticsService } from './statisticsService';
import { activityService } from './activityService';
import { taskService } from './taskService';
import { projectService } from './projectService';

const SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch-1',
    time: '10:30 AM',
    title: 'Peer review and design discussion',
    completed: false,
  },
  {
    id: 'sch-2',
    time: '11:00 AM - 12:30 PM',
    title: 'Read the case study and user interview report',
    completed: false,
  },
  {
    id: 'sch-3',
    time: '1:30 PM',
    title: 'Stand-up and get ready for the designs',
    completed: false,
  },
  {
    id: 'sch-4',
    time: '2:30 PM',
    title: 'Stakeholder meeting with PM',
    completed: false,
  },
  {
    id: 'sch-5',
    time: '3:15 PM',
    title: 'User flow presentation',
    completed: false,
  },
];

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'qa-1', label: 'New Task', path: '/tasks', icon: 'plus' },
  { id: 'qa-2', label: 'Projects', path: '/projects', icon: 'folder' },
  { id: 'qa-3', label: 'Team', path: '/teams', icon: 'users' },
  { id: 'qa-4', label: 'Reports', path: '/reports', icon: 'chart' },
];

export interface DashboardQuery {
  tasks: Task[];
  projects: Project[];
  events: ActivityEvent[];
  user: DashboardUser | null;
}

class DashboardService {
  async getSchedule(): Promise<ScheduleItem[]> {
    return SCHEDULE;
  }

  async getQuickActions(): Promise<QuickAction[]> {
    return QUICK_ACTIONS;
  }

  async getDashboard(query: DashboardQuery): Promise<DashboardData> {
    const [statistics, projects, schedule, quickActions, assignedTasks, deadlines, activities] =
      await Promise.all([
        statisticsService.getStatistics({
          tasks: query.tasks,
          projects: query.projects,
        }),
        projectService.getProjectProgress(query.projects),
        this.getSchedule(),
        this.getQuickActions(),
        taskService.getAssignedTasks(query.tasks, query.user),
        taskService.getUpcomingDeadlines(query.tasks),
        activityService.getRecentActivity({
          events: query.events,
          tasks: query.tasks,
        }),
      ]);

    return {
      statistics,
      projects,
      schedule,
      quickActions,
      assignedTasks,
      deadlines,
      activities,
    };
  }
}

export const dashboardService = new DashboardService();
