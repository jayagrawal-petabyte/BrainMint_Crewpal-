import { create } from 'zustand';
import { dashboardService } from '../../services/dashboardService';
import { getErrorMessage } from '../../services/apiErrors';
import { useTaskStore } from '../tasks';
import { useProjectStore } from '../projects';
import { useActivityStore } from '../tasks/activityStore';
import type {
  AssignedTask,
  DashboardActivity,
  DashboardStatistics,
  DashboardUser,
  DeadlineItem,
  ProjectProgress,
  QuickAction,
  ScheduleItem,
} from '../../types/dashboard';

interface DashboardState {
  statistics: DashboardStatistics | null;
  projects: ProjectProgress[];
  schedule: ScheduleItem[];
  assignedTasks: AssignedTask[];
  deadlines: DeadlineItem[];
  activities: DashboardActivity[];
  quickActions: QuickAction[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
  currentUser: DashboardUser | null;
  load: (user: DashboardUser | null) => Promise<void>;
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  statistics: null,
  projects: [],
  schedule: [],
  assignedTasks: [],
  deadlines: [],
  activities: [],
  quickActions: [],
  loading: false,
  error: null,
  loaded: false,
  currentUser: null,
};

const fetchDashboardData = async (user: DashboardUser | null) => {
  const tasks = useTaskStore.getState().tasks;
  const projects = useProjectStore.getState().projects;
  const events = useActivityStore.getState().events;

  return dashboardService.getDashboard({ tasks, projects, events, user });
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  ...initialState,

  load: async (user) => {
    set({ currentUser: user, loading: true, error: null });

    try {
      const data = await fetchDashboardData(user);

      set({
        statistics: data.statistics,
        projects: data.projects,
        schedule: data.schedule,
        assignedTasks: data.assignedTasks,
        deadlines: data.deadlines,
        activities: data.activities,
        quickActions: data.quickActions,
        loading: false,
        error: null,
        loaded: true,
      });
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error), loaded: true });
    }
  },

  refresh: async () => {
    const { currentUser } = get();

    if (!currentUser) {
      return;
    }

    try {
      const data = await fetchDashboardData(currentUser);

      set({
        statistics: data.statistics,
        projects: data.projects,
        schedule: data.schedule,
        assignedTasks: data.assignedTasks,
        deadlines: data.deadlines,
        activities: data.activities,
        quickActions: data.quickActions,
        error: null,
        loaded: true,
      });
    } catch (error) {
      set({ error: getErrorMessage(error) });
    }
  },

  retry: async () => {
    const { currentUser } = get();
    await get().load(currentUser);
  },

  reset: () => {
    set(initialState);
  },
}));
