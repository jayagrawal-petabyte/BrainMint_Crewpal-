export interface DashboardStat {
  id: string;
  title: string;
  value: number;
}

export interface ProjectProgress {
  id: string;
  name: string;
  frontend: number;
  backend: number;
  cyberChecks: number;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  completed: boolean;
}

export interface DashboardData {
  stats: DashboardStat[];
  projects: ProjectProgress[];
  schedule: ScheduleItem[];
}