// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from '../../contexts/AuthContext';
// import { useDashboard } from '../../hooks/useDashboard';
// import { useTranslation } from '../../hooks/useTranslation';
// import { useTaskStore } from '../../store/tasks';
// import { useProjectStore } from '../../store/projects';
// import { useActivityStore } from '../../store/tasks/activityStore';
// import { DashboardSkeleton } from '../../components/dashboard/DashboardSkeleton';
// import { GreetingCard } from '../../components/dashboard/GreetingCard';
// import { StatisticsGrid } from '../../components/dashboard/StatisticsGrid';
// import { QuickActions } from '../../components/dashboard/QuickActions';
// import { AssignedTasksWidget } from '../../components/dashboard/AssignedTasksWidget';
// import { UpcomingDeadlines } from '../../components/dashboard/UpcomingDeadlines';
// import { RecentActivityWidget } from '../../components/dashboard/RecentActivityWidget';
// import { ProjectProgressWidget } from '../../components/dashboard/ProjectProgressWidget';
// import { TodaySchedule } from '../../components/dashboard/TodaySchedule';
// import { ErrorState } from '../../components/errors/ErrorState';
// import { User, RefreshCw } from 'lucide-react';

// export const Dashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const {
//     statistics,
//     projects,
//     schedule,
//     assignedTasks,
//     deadlines,
//     activities,
//     quickActions,
//     loading,
//     error,
//     loaded,
//     load,
//     refresh,
//     retry,
//   } = useDashboard();
//   const { t } = useTranslation();

//   useEffect(() => {
//     if (user) {
//       void load({ id: user.id, name: user.name, email: user.email });
//     }
//   }, [user, load]);

//   useEffect(() => {
//     const unsubTasks = useTaskStore.subscribe(() => void refresh());
//     const unsubProjects = useProjectStore.subscribe(() => void refresh());
//     const unsubActivity = useActivityStore.subscribe(() => void refresh());

//     return () => {
//       unsubTasks();
//       unsubProjects();
//       unsubActivity();
//     };
//   }, [refresh]);

//   const isLoading = loading || (!loaded && statistics === null);
//   const isFatalError = !isLoading && error !== null && statistics === null;

//   return (
//     <div className="space-y-6 animate-in fade-in duration-300">
//       {/* ─── DESKTOP HEADER ─── */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">{t.overview}</h1>
//           <p className="text-sm text-forest-500 mt-1">Welcome back, {user?.name || 'Intern'} — here&apos;s your daily overview.</p>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => void refresh()}
//             className="p-2.5 rounded-xl border border-cream-300 bg-white hover:bg-cream-100 text-forest-700 transition shadow-xs flex items-center gap-2 text-xs font-semibold cursor-pointer"
//             title="Refresh data"
//           >
//             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//             <span className="hidden sm:inline">Refresh</span>
//           </button>

//           <button
//             onClick={() => navigate("/user-dashboard")}
//             className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-cream-100 font-semibold text-xs transition shadow-sm cursor-pointer"
//           >
//             <User className="w-4 h-4" />
//             <span>Profile</span>
//           </button>
//         </div>
//       </div>

//       {isLoading ? (
//         <DashboardSkeleton />
//       ) : isFatalError ? (
//         <ErrorState
//           title="Failed to load dashboard"
//           message={error}
//           onRetry={() => void retry()}
//         />
//       ) : (
//         <div className="space-y-6">
//           {/* Top Greeting & Stat Cards */}
//           <GreetingCard userName={user?.name ?? 'there'} />

//           {statistics && <StatisticsGrid statistics={statistics} />}

//           {/* Main Desktop Grid (2 Columns: Left Main + Right Sidebar) */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Left Primary Column (2/3 width) */}
//             <div className="lg:col-span-2 space-y-6">
//               <AssignedTasksWidget
//                 tasks={assignedTasks}
//                 title={t.assignedTasks}
//                 emptyTitle="No assigned tasks"
//                 emptyDescription="You have no tasks assigned to you right now."
//               />

//               <ProjectProgressWidget
//                 projects={projects}
//                 title={t.projectProgress}
//                 emptyTitle="No projects yet"
//                 emptyDescription="Create a project to start tracking progress."
//               />

//               <RecentActivityWidget
//                 activities={activities}
//                 title={t.recentActivity}
//                 emptyTitle="No recent activity"
//                 emptyDescription="Activity from your team will show up here."
//               />
//             </div>

//             {/* Right Sidebar Column (1/3 width) */}
//             <div className="space-y-6">
//               <QuickActions actions={quickActions} title={t.quickActions} />

//               <TodaySchedule items={schedule} title={t.todaySchedule} />

//               <UpcomingDeadlines
//                 deadlines={deadlines}
//                 title={t.upcomingDeadlines}
//                 emptyTitle="No upcoming deadlines"
//                 emptyDescription="All caught up — no tasks due soon."
//               />

//               {error && statistics && (
//                 <ErrorState
//                   compact
//                   title="Couldn't refresh"
//                   message={error}
//                   onRetry={() => void retry()}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { useDashboard } from '../../hooks/useDashboard';
import { useTranslation } from '../../hooks/useTranslation';
import { useTaskStore } from '../../store/tasks';
import { useProjectStore } from '../../store/projects';
import { useActivityStore } from '../../store/tasks/activityStore';
import { DashboardSkeleton } from '../../components/dashboard/DashboardSkeleton';
import { StatisticsGrid } from '../../components/dashboard/StatisticsGrid';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { AssignedTasksWidget } from '../../components/dashboard/AssignedTasksWidget';
import { UpcomingDeadlines } from '../../components/dashboard/UpcomingDeadlines';
import { RecentActivityWidget } from '../../components/dashboard/RecentActivityWidget';
import { ProjectProgressWidget } from '../../components/dashboard/ProjectProgressWidget';
import { TodaySchedule } from '../../components/dashboard/TodaySchedule';
import { ErrorState } from '../../components/errors/ErrorState';
import { User, RefreshCw } from 'lucide-react';

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
  const isFatalError = !isLoading && error !== null && statistics === null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ─── DESKTOP HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">{t.overview}</h1>
          <p className="text-sm text-forest-500 mt-1">Welcome back, {user?.name || 'Intern'} — here's your daily overview.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => void refresh()}
            className="p-2.5 rounded-xl border border-cream-300 bg-white hover:bg-cream-100 text-forest-700 transition shadow-xs flex items-center gap-2 text-xs font-semibold cursor-pointer"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => navigate("/user-dashboard")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-cream-100 font-semibold text-xs transition shadow-sm cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : isFatalError ? (
        <ErrorState
          title="Failed to load dashboard"
          message={error}
          onRetry={() => void retry()}
        />
      ) : (
        <div className="space-y-6">
          
          {/* STATS ROW: Highest priority overview */}
          {statistics && <StatisticsGrid statistics={statistics} />}

          {/* MAIN GRID: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: Immediate Action & Context */}
            <div className="lg:col-span-2 space-y-6">
              <AssignedTasksWidget
                tasks={assignedTasks}
                title={t.assignedTasks}
                emptyTitle="No assigned tasks"
                emptyDescription="You have no tasks assigned to you right now."
                onViewAll={() => navigate('/tasks')} 
              />

              <ProjectProgressWidget
                projects={projects}
                title={t.projectProgress}
                emptyTitle="No projects yet"
                emptyDescription="Create a project to start tracking progress."
                onViewAll={() => navigate('/projects')} 
              />

              <RecentActivityWidget
                activities={activities}
                title={t.recentActivity}
                emptyTitle="No recent activity"
                emptyDescription="Activity from your team will show up here."
              />
            </div>

            {/* RIGHT COLUMN: Time-sensitive & Actions */}
            <div className="space-y-6">
              
              {/* Prioritized Deadlines moved to the top */}
              <UpcomingDeadlines
                deadlines={deadlines}
                title={t.upcomingDeadlines}
                emptyTitle="No upcoming deadlines"
                emptyDescription="All caught up — no tasks due soon."
                onViewAll={() => navigate('/tasks')} 
              />

              <TodaySchedule 
                items={schedule} 
                title={t.todaySchedule} 
                onViewAll={() => navigate('/meetings')} 
              />

              {/* Moved Quick Actions down as it's secondary to immediate deadlines */}
              <QuickActions actions={quickActions} title={t.quickActions} />

              {error && statistics && (
                <ErrorState
                  compact
                  title="Couldn't refresh"
                  message={error}
                  onRetry={() => void retry()}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};