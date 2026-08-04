export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  TESTING = 'TESTING',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class CreateTaskDto {
  title!: string;
  description?: string;
  organizationId!: string;
  projectId!: string;
  priority?: TaskPriority = TaskPriority.MEDIUM;
  status?: TaskStatus = TaskStatus.TODO;
  assigneeId?: string;
  sprintId?: string;
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  sprintId?: string;
}
