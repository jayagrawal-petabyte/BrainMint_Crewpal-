import type { Project } from '../types/project';
import type { Task } from '../types/task';
import { projectService } from './projectService';
import { taskService } from './taskService';

export interface ReportSummary {
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  pendingProjects: number;
}

export interface ProjectProgress {
  name: string;
  progress: number;
}

export interface MonthlyReport {
  month: string;
  completed: number;
  pending: number;
}

export interface ReportData {
  summary: ReportSummary;
  projectProgress: ProjectProgress[];
  monthlyReports: MonthlyReport[];
}

export interface GenerateReportOptions {
  projects?: Project[];
  tasks?: Task[];
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const generateReportData = (projects: Project[], tasks: Task[]): ReportData => {
  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const activeProjects = projects.filter((p) => p.status === 'on_track').length;
  const pendingProjects = projects.filter((p) => p.status === 'delayed').length;

  const projectProgress: ProjectProgress[] = projects.map((proj) => {
    if (proj.status === 'completed') {
      return { name: proj.name, progress: 100 };
    }

    if (typeof proj.progress === 'number' && proj.progress > 0) {
      return { name: proj.name, progress: Math.min(100, Math.max(0, proj.progress)) };
    }

    // Calculate from linked tasks if available
    const projTasks = tasks.filter((t) => t.projectId === proj.id);
    if (projTasks.length > 0) {
      const completedTasksCount = projTasks.filter((t) => t.status === 'completed').length;
      return {
        name: proj.name,
        progress: Math.round((completedTasksCount / projTasks.length) * 100),
      };
    }

    // Fallback based on status
    const statusProgress = proj.status === 'on_track' ? 40 : proj.status === 'delayed' ? 20 : 0;
    return {
      name: proj.name,
      progress: statusProgress,
    };
  });

  // Calculate monthly stats dynamically from real project creation dates
  const currentMonthIdx = new Date().getMonth();
  const displayMonths = [
    MONTH_NAMES[(currentMonthIdx - 3 + 12) % 12],
    MONTH_NAMES[(currentMonthIdx - 2 + 12) % 12],
    MONTH_NAMES[(currentMonthIdx - 1 + 12) % 12],
    MONTH_NAMES[currentMonthIdx],
  ];

  const monthlyCounts: Record<string, { completed: number; pending: number }> = {};
  for (const m of displayMonths) {
    monthlyCounts[m] = { completed: 0, pending: 0 };
  }

  projects.forEach((proj) => {
    if (proj.createdAt) {
      const date = new Date(proj.createdAt);
      if (!isNaN(date.getTime())) {
        const monthName = MONTH_NAMES[date.getMonth()];
        if (monthlyCounts[monthName]) {
          if (proj.status === 'completed') {
            monthlyCounts[monthName].completed += 1;
          } else {
            monthlyCounts[monthName].pending += 1;
          }
        }
      }
    }
  });

  const monthlyReports: MonthlyReport[] = displayMonths.map((month) => ({
    month,
    completed: monthlyCounts[month]?.completed ?? 0,
    pending: monthlyCounts[month]?.pending ?? 0,
  }));

  return {
    summary: {
      totalProjects,
      completedProjects,
      activeProjects,
      pendingProjects,
    },
    projectProgress,
    monthlyReports,
  };
};

class ReportService {
  async getReports(options?: GenerateReportOptions): Promise<ReportData> {
    let projects = options?.projects;
    let tasks = options?.tasks;

    if (!projects) {
      try {
        projects = await projectService.getProjects();
      } catch {
        projects = [];
      }
    }

    if (!tasks) {
      try {
        tasks = await taskService.getTasks();
      } catch {
        tasks = [];
      }
    }

    return generateReportData(projects || [], tasks || []);
  }
}

const reportService = new ReportService();

export default reportService;