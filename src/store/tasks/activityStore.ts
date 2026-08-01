import { create } from 'zustand';
import type { ActivityEvent, ActivityEventType } from '../../types/activity';

interface ActivityState {
  events: ActivityEvent[];
  logEvent: (
    taskId: string,
    type: ActivityEventType,
    actorName: string,
    actorInitials: string,
    message: string,
    meta?: Record<string, string>
  ) => void;
  getTaskEvents: (taskId: string) => ActivityEvent[];
  clearTaskEvents: (taskId: string) => void;
}

// Seed with a few events for demo tasks
const SEED_EVENTS: ActivityEvent[] = [
  {
    id: 'evt-001',
    taskId: 'task-3',
    type: 'task_created',
    actorName: 'Jay Agrawal',
    actorInitials: 'JA',
    message: 'Created this task',
    timestamp: '2026-07-14T09:00:00Z',
  },
  {
    id: 'evt-002',
    taskId: 'task-3',
    type: 'status_changed',
    actorName: 'Harsh Gupta',
    actorInitials: 'HG',
    message: 'Changed status from On Track → Delayed',
    timestamp: '2026-07-18T10:30:00Z',
    meta: { from: 'on_track', to: 'delayed' },
  },
  {
    id: 'evt-003',
    taskId: 'task-3',
    type: 'comment_added',
    actorName: 'Jay Agrawal',
    actorInitials: 'JA',
    message: 'Added a comment: "We need to finalize filter combinations."',
    timestamp: '2026-07-18T14:00:00Z',
  },
  {
    id: 'evt-004',
    taskId: 'task-3',
    type: 'subtask_completed',
    actorName: 'Harsh Gupta',
    actorInitials: 'HG',
    message: 'Completed subtask: "Search by name"',
    timestamp: '2026-07-19T11:00:00Z',
  },
  {
    id: 'evt-005',
    taskId: 'task-1',
    type: 'task_created',
    actorName: 'Jay Agrawal',
    actorInitials: 'JA',
    message: 'Created this task',
    timestamp: '2026-07-15T10:00:00Z',
  },
  {
    id: 'evt-006',
    taskId: 'task-1',
    type: 'assignee_added',
    actorName: 'Jay Agrawal',
    actorInitials: 'JA',
    message: 'Assigned Harsh Gupta to this task',
    timestamp: '2026-07-15T10:05:00Z',
  },
];

export const useActivityStore = create<ActivityState>((set, get) => ({
  events: SEED_EVENTS,

  logEvent: (taskId, type, actorName, actorInitials, message, meta) => {
    const event: ActivityEvent = {
      id: `evt-${Date.now()}`,
      taskId,
      type,
      actorName,
      actorInitials,
      message,
      timestamp: new Date().toISOString(),
      meta,
    };
    set((state) => ({ events: [...state.events, event] }));
  },

  getTaskEvents: (taskId) => {
    return get()
      .events.filter((e) => e.taskId === taskId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  clearTaskEvents: (taskId) => {
    set((state) => ({ events: state.events.filter((e) => e.taskId !== taskId) }));
  },
}));
