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

// Seed with activity events for all demo tasks
const SEED_EVENTS: ActivityEvent[] = [
  // ── task-1 ──
  { id: 'evt-001', taskId: 'task-1', type: 'task_created',    actorName: 'Jay Agrawal',  actorInitials: 'JA', message: 'Created this task',                             timestamp: '2026-07-15T10:00:00Z' },
  { id: 'evt-002', taskId: 'task-1', type: 'assignee_added',  actorName: 'Jay Agrawal',  actorInitials: 'JA', message: 'Assigned Harsh Gupta to this task',              timestamp: '2026-07-15T10:05:00Z' },
  { id: 'evt-003', taskId: 'task-1', type: 'priority_changed',actorName: 'Harsh Gupta',  actorInitials: 'HG', message: 'Set priority to High',                          timestamp: '2026-07-15T11:00:00Z' },

  // ── task-2 ──
  { id: 'evt-004', taskId: 'task-2', type: 'task_created',    actorName: 'Harsh Gupta',  actorInitials: 'HG', message: 'Created this task',                             timestamp: '2026-07-16T11:00:00Z' },
  { id: 'evt-005', taskId: 'task-2', type: 'assignee_added',  actorName: 'Harsh Gupta',  actorInitials: 'HG', message: 'Assigned Ananya Sharma to this task',           timestamp: '2026-07-16T11:10:00Z' },
  { id: 'evt-006', taskId: 'task-2', type: 'status_changed',  actorName: 'Jay Agrawal',  actorInitials: 'JA', message: 'Changed status On Track → On Track (confirmed)', timestamp: '2026-07-17T09:00:00Z' },

  // ── task-3 ──
  { id: 'evt-007', taskId: 'task-3', type: 'task_created',    actorName: 'Jay Agrawal',  actorInitials: 'JA', message: 'Created this task',                             timestamp: '2026-07-14T09:00:00Z' },
  { id: 'evt-008', taskId: 'task-3', type: 'status_changed',  actorName: 'Harsh Gupta',  actorInitials: 'HG', message: 'Changed status from On Track → Delayed',        timestamp: '2026-07-18T10:30:00Z', meta: { from: 'on_track', to: 'delayed' } },
  { id: 'evt-009', taskId: 'task-3', type: 'comment_added',   actorName: 'Jay Agrawal',  actorInitials: 'JA', message: 'Added a comment: "We need to finalize filter combinations."', timestamp: '2026-07-18T14:00:00Z' },
  { id: 'evt-010', taskId: 'task-3', type: 'subtask_completed',actorName: 'Harsh Gupta', actorInitials: 'HG', message: 'Completed subtask: "Search by name"',           timestamp: '2026-07-19T11:00:00Z' },
  { id: 'evt-011', taskId: 'task-3', type: 'subtask_completed',actorName: 'Harsh Gupta', actorInitials: 'HG', message: 'Completed subtask: "Filter by status"',         timestamp: '2026-07-20T09:30:00Z' },

  // ── task-4 ──
  { id: 'evt-012', taskId: 'task-4', type: 'task_created',    actorName: 'Ananya Sharma',actorInitials: 'AS', message: 'Created this task',                             timestamp: '2026-07-16T08:00:00Z' },
  { id: 'evt-013', taskId: 'task-4', type: 'status_changed',  actorName: 'Harsh Gupta',  actorInitials: 'HG', message: 'Changed status from On Track → Completed',      timestamp: '2026-07-20T16:00:00Z', meta: { from: 'on_track', to: 'completed' } },
  { id: 'evt-014', taskId: 'task-4', type: 'comment_added',   actorName: 'Ananya Sharma',actorInitials: 'AS', message: 'Added a comment: "All modals are tested and working."', timestamp: '2026-07-20T16:30:00Z' },

  // ── task-5 ──
  { id: 'evt-015', taskId: 'task-5', type: 'task_created',    actorName: 'Rohan Verma',  actorInitials: 'RV', message: 'Created this task',                             timestamp: '2026-07-17T10:00:00Z' },
  { id: 'evt-016', taskId: 'task-5', type: 'assignee_added',  actorName: 'Rohan Verma',  actorInitials: 'RV', message: 'Assigned Priya Nair to this task',              timestamp: '2026-07-17T10:15:00Z' },
  { id: 'evt-017', taskId: 'task-5', type: 'due_date_changed',actorName: 'Harsh Gupta',  actorInitials: 'HG', message: 'Updated due date to Aug 15, 2026',             timestamp: '2026-07-19T14:00:00Z' },
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
