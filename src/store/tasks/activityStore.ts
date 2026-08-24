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
const SEED_EVENTS: ActivityEvent[] = [];

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
