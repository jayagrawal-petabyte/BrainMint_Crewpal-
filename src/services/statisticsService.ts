import type { Project } from '../types/project';
import type { Task } from '../types/task';
import type { DashboardStatistics } from '../types/dashboard';
import { todayString } from '../utils/format';

export interface StatisticsInput {
  tasks: Task[];
  projects: Project[];
}

export const buildStatistics = ({
  tasks,
  projects,
}: StatisticsInput): DashboardStatistics => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const today = todayString();
  const overdueTasks = tasks.filter(
    (task) => task.status !== 'completed' && task.dueDate < today
  ).length;
  const onTrackTasks = tasks.filter((task) => task.status === 'on_track').length;
  const delayedTasks = tasks.filter((task) => task.status === 'delayed').length;
  const highPriorityTasks = tasks.filter((task) => task.priority === 'high').length;
  const productivity =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return {
    totalProjects: projects.length,
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    onTrackTasks,
    delayedTasks,
    highPriorityTasks,
    productivity,
  };
};

class StatisticsService {
  async getStatistics(input: StatisticsInput): Promise<DashboardStatistics> {
    return buildStatistics(input);
  }
}

export const statisticsService = new StatisticsService();
