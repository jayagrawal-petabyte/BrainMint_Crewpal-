export type TaskStatus = 'on_track' | 'delayed' | 'completed';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Assignee {
  id: string;
  name: string;
  avatarColor?: string;
  initials: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  techTag: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD
  assignees: Assignee[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilter {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
}
