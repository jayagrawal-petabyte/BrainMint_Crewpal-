# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added — Dashboard System

**feat: implement dashboard system with global state management and error handling**

Owned by: Harish (Dashboard, Statistics, Assigned Tasks, Recent Activity, Loading State, Global Error Handling).

#### New components (`src/components/dashboard/`)
- `GreetingCard` — time-based greeting with date and avatar.
- `StatCard` — reusable stat tile with icon, value, and stagger animation.
- `StatisticsGrid` — 2-column grid: total projects, completed, pending, overdue tasks + productivity bar.
- `QuickActions` — 4 navigation shortcuts (New Task, Projects, Team, Reports).
- `AssignedTasksWidget` — current user's tasks with status badge + due date.
- `UpcomingDeadlines` — sorted deadlines with overdue / due-today / days-left labels.
- `RecentActivityWidget` — team activity feed with actor avatars and relative timestamps.
- `ProjectProgressWidget` — per-project frontend/backend/checks progress bars.
- `TodaySchedule` — today's schedule checklist.
- `DashboardSkeleton` — shimmer loading placeholder.

#### Global error handling (`src/components/errors/`)
- `ErrorBoundary` — app-wide render-error fallback with retry.
- `ErrorState` — full and compact error UI with retry button.
- `SessionExpiredHandler` — listens for `crewpal:unauthorized` and logs out.
- `src/App.tsx` — wrapped the app with `ErrorBoundary` + `SessionExpiredHandler` (only extension; no other App/route changes).

#### State management
- `src/store/dashboard/index.ts` — Zustand dashboard store with `load`, `refresh`, `retry`, `reset` and a `loaded` flag; aggregates live data from the existing task/project/activity stores (read-only).
- `src/hooks/useDashboard.ts` — hook exposing dashboard state and actions.

#### Services (mock-backed, HTTP-ready)
- `src/services/apiClient.ts` — typed `fetch` wrapper: base URL from `VITE_API_BASE_URL`, auth header from `crewpal_access_token`, 15s timeout, JSON handling.
- `src/services/apiErrors.ts` — `ApiError` codes (`network | timeout | unauthorized | forbidden | not_found | server | unknown`) + `getErrorMessage`.
- `src/services/statisticsService.ts` — computes `DashboardStatistics` from tasks/projects.
- `src/services/activityService.ts` — maps activity events to the feed.
- `src/services/taskService.ts` — assigned tasks + upcoming deadlines for the current user.
- `src/services/projectService.ts` — project progress percentages.
- `src/services/authService.ts` — demo-account login flow (mock fallback when API is down).
- `src/services/dashboardService.ts` — aggregates all dashboard data in parallel.

#### Utilities & types
- `src/utils/format.ts` — `todayString`, `daysUntil`, `isOverdue`, `formatShortDate`, `formatRelativeTime`, `getGreeting`, `normalizeText`.
- `src/types/dashboard.ts` — `DashboardStatistics`, `AssignedTask`, `DeadlineItem`, `DashboardActivity`, `ProjectProgress`, `ScheduleItem`, `QuickAction`, `DashboardData`.
- `src/hooks/useTranslation.ts` — added dashboard labels (overview, statistics, quick actions, assigned tasks, deadlines, activity, progress, schedule) in en/hi/es/fr/de/ja/zh.

#### Page
- `src/pages/dashboard/index.tsx` — rebuilt with loading skeleton, fatal-error + retry, inline refresh-error, and empty states; auto-refreshes when tasks/projects/activity change. Original header/container styling preserved.

### Verification
- `tsc -b` passes with **zero errors in dashboard-scope files**.
- Pre-existing project-wide blockers (not introduced here): no `eslint.config.js` for ESLint 9, and teammate modules contain TypeScript errors that currently block the full `npm run build`.
