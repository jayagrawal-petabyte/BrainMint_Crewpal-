export interface ProjectOverview {
  totalProjects: number;
  activeProjects: number;
}

export interface TaskStatistics {
  totalTasks: number;
  todo: number;
  inProgress: number;
  inReview: number;
  testing: number;
  done: number;
}

export interface AssignedTasks {
  myTasks: number;
  pending: number;
  completed: number;
}

export interface SprintOverview {
  planned: number;
  active: number;
  completed: number;
}

export interface DashboardData {
  projectOverview: ProjectOverview;
  taskStatistics: TaskStatistics;
  assignedTasks: AssignedTasks;
  sprintOverview: SprintOverview;
}
