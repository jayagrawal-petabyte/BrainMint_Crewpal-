import type { TaskStatus, TaskPriority } from './task';
import type { ActivityEventType } from './activity';

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

export interface DashboardStatistics {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  onTrackTasks: number;
  delayedTasks: number;
  highPriorityTasks: number;
  productivity: number;
}

export interface AssignedTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectName: string;
}

export interface DeadlineItem {
  id: string;
  title: string;
  dueDate: string;
  projectName: string;
  daysLeft: number;
  overdue: boolean;
}

export interface DashboardActivity {
  id: string;
  taskId: string;
  type: ActivityEventType;
  actorName: string;
  actorInitials: string;
  message: string;
  timestamp: string;
  taskTitle: string;
}

export type QuickActionIcon = 'plus' | 'folder' | 'users' | 'chart';

export interface QuickAction {
  id: string;
  label: string;
  path: string;
  icon: QuickActionIcon;
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
}

export interface DashboardData {
  statistics: DashboardStatistics;
  projects: ProjectProgress[];
  schedule: ScheduleItem[];
  assignedTasks: AssignedTask[];
  deadlines: DeadlineItem[];
  activities: DashboardActivity[];
  quickActions: QuickAction[];
}
