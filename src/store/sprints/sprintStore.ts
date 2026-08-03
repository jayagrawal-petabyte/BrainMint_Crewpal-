import { create } from 'zustand';
import type { Sprint, MeetingItem } from '../../types/sprint';

interface SprintState {
  sprints: Sprint[];
  activeSprintId: string | null;
  
  // Actions
  createSprint: (data: { name: string; goal: string; startDate: string; endDate: string; meetings?: MeetingItem[] }) => void;
  startSprint: (sprintId: string) => void;
  completeSprint: (sprintId: string) => void;
  addMeetingToSprint: (sprintId: string, meeting: Omit<MeetingItem, 'id'>) => void;
  deleteSprint: (sprintId: string) => void;
}

const INITIAL_SPRINTS: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 1 - Architecture & Setup',
    goal: 'Complete core navigation, layout, design tokens and initial project meetings.',
    startDate: '2026-07-01',
    endDate: '2026-07-15',
    status: 'completed',
    meetings: [
      {
        id: 'm1',
        title: 'Project Kickoff & Architecture Alignment',
        time: '10:00 AM - 11:30 AM',
        duration: '1h 30m',
        locationOrLink: 'Google Meet',
        attendeesCount: 8,
        status: 'completed',
        organizer: 'Jay Agrawal',
        agenda: 'Define tech stack, component tree, design tokens in Tailwind & state strategy.',
      },
      {
        id: 'm2',
        title: 'Design Review & Component Sync',
        time: '02:00 PM - 03:00 PM',
        duration: '1h 00m',
        locationOrLink: 'Room 3A / Zoom',
        attendeesCount: 5,
        status: 'completed',
        organizer: 'Ananya Sharma',
        agenda: 'Review Figma wireframes for Task and Meetings board.',
      },
    ],
    createdAt: '2026-07-01T09:00:00Z',
    updatedAt: '2026-07-15T18:00:00Z',
  },
  {
    id: 'sprint-2',
    name: 'Sprint 2 - Meeting & Task Enhancements',
    goal: 'Build Meeting page matching Figma design node 38:2737 and enable Sprint actions.',
    startDate: '2026-07-16',
    endDate: '2026-08-05',
    status: 'active',
    meetings: [
      {
        id: 'm3',
        title: 'Daily Standup - Sprint 2 Progress',
        time: '09:30 AM - 09:45 AM',
        duration: '15m',
        locationOrLink: 'Huddle',
        attendeesCount: 6,
        status: 'upcoming',
        organizer: 'Jay Agrawal',
        agenda: 'Check blockers for Sprint Start & Complete state handler implementation.',
      },
      {
        id: 'm4',
        title: 'Sprint Planning & Meeting UI Sync',
        time: '04:00 PM - 05:00 PM',
        duration: '1h 00m',
        locationOrLink: 'Conference Room B',
        attendeesCount: 7,
        status: 'upcoming',
        organizer: 'Harsh Gupta',
        agenda: 'Review meeting schedule card UI and backend integration mock schemas.',
      },
    ],
    createdAt: '2026-07-16T09:00:00Z',
    updatedAt: '2026-07-16T09:00:00Z',
  },
  {
    id: 'sprint-3',
    name: 'Sprint 3 - Performance & Production Readiness',
    goal: 'Optimize LCP, error telemetry, and prepare final release artifact.',
    startDate: '2026-08-06',
    endDate: '2026-08-20',
    status: 'planned',
    meetings: [
      {
        id: 'm5',
        title: 'Pre-release Security & Audit Meeting',
        time: '11:00 AM - 12:00 PM',
        duration: '1h 00m',
        locationOrLink: 'Security Room',
        attendeesCount: 4,
        status: 'upcoming',
        organizer: 'Jay Agrawal',
        agenda: 'Review role-based permissions and mock JWT auth tokens.',
      },
    ],
    createdAt: '2026-07-28T10:00:00Z',
    updatedAt: '2026-07-28T10:00:00Z',
  },
];

export const useSprintStore = create<SprintState>((set) => ({
  sprints: INITIAL_SPRINTS,
  activeSprintId: 'sprint-2',

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
        // If another sprint was active, make it planned or keep as is
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
