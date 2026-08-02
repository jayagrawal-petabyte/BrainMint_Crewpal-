// Activity Timeline types for Task activity feed

export type ActivityEventType =
  | 'status_changed'
  | 'priority_changed'
  | 'comment_added'
  | 'subtask_added'
  | 'subtask_completed'
  | 'assignee_added'
  | 'task_created'
  | 'due_date_changed';

export interface ActivityEvent {
  id: string;
  taskId: string;
  type: ActivityEventType;
  actorName: string;
  actorInitials: string;
  message: string;           // e.g. "Changed status from On Track → Delayed"
  timestamp: string;         // ISO string
  meta?: Record<string, string>; // optional extra data
}
