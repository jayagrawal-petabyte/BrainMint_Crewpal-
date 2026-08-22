import { create } from 'zustand';
import type { Sprint, MeetingItem } from '../../types/sprint';
import { sprintService } from '../../services/sprintService';

interface SprintState {
  sprints: Sprint[];
  activeSprintId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSprints: () => Promise<void>;
  createSprint: (data: { name: string; goal: string; startDate: string; endDate: string; meetings?: MeetingItem[] }) => void;
  startSprint: (sprintId: string) => void;
  completeSprint: (sprintId: string) => void;
  addMeetingToSprint: (sprintId: string, meeting: Omit<MeetingItem, 'id'>) => void;
  deleteSprint: (sprintId: string) => void;
}

export const useSprintStore = create<SprintState>((set) => ({
  sprints: [],
  activeSprintId: null,
  isLoading: false,
  error: null,

  fetchSprints: async () => {
    set({ isLoading: true, error: null });
    try {
      const sprints = await sprintService.getSprints();
      const list = Array.isArray(sprints) ? sprints : [];
      const active = list.find((s) => s.status === 'active')?.id ?? list[0]?.id ?? null;
      set({ sprints: list, activeSprintId: active, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to retrieve sprints from backend API.',
        isLoading: false,
      });
    }
  },

  createSprint: (data) => {
    const newSprint: Sprint = {
      id: `sprint-${Date.now()}`,
      name: data.name,
      goal: data.goal,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'planned',
      meetings: data.meetings || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      sprints: [...state.sprints, newSprint],
    }));
  },

  startSprint: (sprintId) => {
    set((state) => ({
      sprints: state.sprints.map((s) => {
        if (s.id === sprintId) {
          return { ...s, status: 'active', updatedAt: new Date().toISOString() };
        }
        return s;
      }),
      activeSprintId: sprintId,
    }));
  },

  completeSprint: (sprintId) => {
    set((state) => ({
      sprints: state.sprints.map((s) => {
        if (s.id === sprintId) {
          return { ...s, status: 'completed', updatedAt: new Date().toISOString() };
        }
        return s;
      }),
      activeSprintId: state.activeSprintId === sprintId ? null : state.activeSprintId,
    }));
  },

  addMeetingToSprint: (sprintId, meetingData) => {
    const newMeeting: MeetingItem = {
      ...meetingData,
      id: `m-${Date.now()}`,
    };

    set((state) => ({
      sprints: state.sprints.map((s) => {
        if (s.id === sprintId) {
          return {
            ...s,
            meetings: [...s.meetings, newMeeting],
            updatedAt: new Date().toISOString(),
          };
        }
        return s;
      }),
    }));
  },

  deleteSprint: (sprintId) => {
    set((state) => ({
      sprints: state.sprints.filter((s) => s.id !== sprintId),
      activeSprintId: state.activeSprintId === sprintId ? null : state.activeSprintId,
    }));
  },
}));
