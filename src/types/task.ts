// Task type definitions for the Task Management module

export type TaskStatus = 'on_track' | 'delayed' | 'completed';

export type TaskPriority = 'high' | 'medium' | 'low';

export interface Assignee {
  id: string;
  name: string;
  initials: string;
  avatarColor?: string; // tailwind bg color class e.g. 'bg-rose-300'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  techTag: string;         // e.g. "React + Node"
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;         // ISO date string e.g. "2026-07-25"
  assignees: Assignee[];
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
}

export interface TaskFilter {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
}
