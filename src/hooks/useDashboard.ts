import { useDashboardStore } from '../store/dashboard';

export const useDashboard = () => {
  const statistics = useDashboardStore((state) => state.statistics);
  const projects = useDashboardStore((state) => state.projects);
  const schedule = useDashboardStore((state) => state.schedule);
  const assignedTasks = useDashboardStore((state) => state.assignedTasks);
  const deadlines = useDashboardStore((state) => state.deadlines);
  const activities = useDashboardStore((state) => state.activities);
  const quickActions = useDashboardStore((state) => state.quickActions);
  const loading = useDashboardStore((state) => state.loading);
  const error = useDashboardStore((state) => state.error);
  const loaded = useDashboardStore((state) => state.loaded);
  const load = useDashboardStore((state) => state.load);
  const refresh = useDashboardStore((state) => state.refresh);
  const retry = useDashboardStore((state) => state.retry);

  return {
    statistics,
    projects,
    schedule,
    assignedTasks,
    deadlines,
    activities,
    quickActions,
    loading,
    error,
    loaded,
    load,
    refresh,
    retry,
  };
};
