export type TaskStatus = 'on_track' | 'delayed' | 'completed';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Assignee {
  id: string;
  name: string;
  avatarColor?: string;
  initials: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  text: string;
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string; // e.g. 'image/png', 'application/pdf', etc.
  uploadedAt: string;
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
  comments: Comment[];
  subtasks: Subtask[];
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilter {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
}
