import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { useDashboard } from '../../hooks/useDashboard';
import { useTranslation } from '../../hooks/useTranslation';
import { BottomNav } from '../../components/layout/BottomNav';
import { useTaskStore } from '../../store/tasks';
import { useProjectStore } from '../../store/projects';
import { useActivityStore } from '../../store/tasks/activityStore';
import { DashboardSkeleton } from '../../components/dashboard/DashboardSkeleton';
import { GreetingCard } from '../../components/dashboard/GreetingCard';
import { StatisticsGrid } from '../../components/dashboard/StatisticsGrid';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { AssignedTasksWidget } from '../../components/dashboard/AssignedTasksWidget';
import { UpcomingDeadlines } from '../../components/dashboard/UpcomingDeadlines';
import { RecentActivityWidget } from '../../components/dashboard/RecentActivityWidget';
import { ProjectProgressWidget } from '../../components/dashboard/ProjectProgressWidget';
import { TodaySchedule } from '../../components/dashboard/TodaySchedule';
import { ErrorState } from '../../components/errors/ErrorState';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
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
  } = useDashboard();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      void load({ id: user.id, name: user.name, email: user.email });
    }
  }, [user, load]);

  useEffect(() => {
    const unsubTasks = useTaskStore.subscribe(() => void refresh());
    const unsubProjects = useProjectStore.subscribe(() => void refresh());
    const unsubActivity = useActivityStore.subscribe(() => void refresh());

    return () => {
      unsubTasks();
      unsubProjects();
      unsubActivity();
    };
  }, [refresh]);

  const isLoading = loading || (!loaded && statistics === null);
  const isFatalError =
    !isLoading && error !== null && statistics === null;

  return (
    <div className="min-h-screen bg-[#f5f0e1] text-[#0b170e] font-sans pb-28 px-4 pt-4 max-w-md mx-auto relative shadow-2xl animate-in fade-in duration-300">
      {/* ─── TOP HEADER ─── */}
      <div className="flex items-center justify-between py-2 mb-6">
        <button className="p-1.5 text-[#0b170e] hover:opacity-80 transition-opacity">
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="14" height="3" rx="1.5" fill="#0b170e" />
            <rect y="7" width="22" height="3" rx="1.5" fill="#0b170e" />
            <rect y="14" width="18" height="2" rx="1" fill="#0b170e" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg border-2 border-[#0b170e] flex items-center justify-center bg-transparent">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L8 6L15 1" stroke="#0b170e" strokeWidth="2" strokeLinecap="round" />
              <rect x="1" y="1" width="14" height="10" rx="1" stroke="#0b170e" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-widest text-[#0b170e] leading-tight uppercase">CREWPAL</h1>
            <p className="text-[9px] text-[#426348] font-medium leading-none">Dashboard Overview</p>
          </div>
        </div>

        <button
  onClick={() => navigate("/user-dashboard")}
  className="w-10 h-10 rounded-full bg-[#1e3624] text-[#f5f0e1] flex items-center justify-center shadow-md hover:scale-105 transition-transform"
>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>

      <h2 className="text-3xl font-extrabold text-[#0b170e] mb-4 tracking-tight">{t.overview}</h2>

      {isLoading ? (
        <DashboardSkeleton />
      ) : isFatalError ? (
        <ErrorState
          title="Failed to load dashboard"
          message={error}
          onRetry={() => void retry()}
        />
      ) : (
        <div className="space-y-4">
          <GreetingCard userName={user?.name ?? 'there'} />

          {statistics && <StatisticsGrid statistics={statistics} />}

          <QuickActions actions={quickActions} title={t.quickActions} />

          <AssignedTasksWidget
            tasks={assignedTasks}
            title={t.assignedTasks}
            emptyTitle="No assigned tasks"
            emptyDescription="You have no tasks assigned to you right now."
          />

          <UpcomingDeadlines
            deadlines={deadlines}
            title={t.upcomingDeadlines}
            emptyTitle="No upcoming deadlines"
            emptyDescription="All caught up — no tasks due soon."
          />

          <RecentActivityWidget
            activities={activities}
            title={t.recentActivity}
            emptyTitle="No recent activity"
            emptyDescription="Activity from your team will show up here."
          />

          <ProjectProgressWidget
            projects={projects}
            title={t.projectProgress}
            emptyTitle="No projects yet"
            emptyDescription="Create a project to start tracking progress."
          />

          <TodaySchedule items={schedule} title={t.todaySchedule} />

          {error && statistics && (
            <ErrorState
              compact
              title="Couldn't refresh"
              message={error}
              onRetry={() => void retry()}
            />
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
};
