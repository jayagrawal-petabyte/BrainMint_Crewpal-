import type { ActivityEvent } from '../types/activity';
import type { Project } from '../types/project';
import type { Task } from '../types/task';
import type {
  DashboardData,
  DashboardUser,
  QuickAction,
  ScheduleItem,
} from '../types/dashboard';
import { api } from '../lib/axios';
import { statisticsService } from './statisticsService';
import { activityService } from './activityService';
import { taskService } from './taskService';
import { projectService } from './projectService';

const EMPTY_SCHEDULE: ScheduleItem[] = [];

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
    try {
      const response = await api.get('/dashboard/schedule');
      const payload = response.data as unknown;

      const schedule = Array.isArray(payload)
        ? payload
        : typeof payload === 'object' && payload !== null && 'schedule' in payload
          ? (payload as { schedule?: unknown }).schedule
          : undefined;

      return Array.isArray(schedule) ? schedule as ScheduleItem[] : EMPTY_SCHEDULE;
    } catch {
      return EMPTY_SCHEDULE;
    }
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
