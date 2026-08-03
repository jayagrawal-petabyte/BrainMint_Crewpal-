import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import { MainLayout } from "../components/layout/MainLayout";
import { Projects } from "../pages/projects";
import Login from "../pages/login";
import Forbidden from "../pages/errors/Forbidden";
import ProtectedRoute from "../components/ProtectedRoute";
import { UserRole } from "../types/roles";

const Tasks = lazy(() =>
  import("../pages/tasks").then((module) => ({
    default: module.Tasks,
  }))
);

const Dashboard = lazy(() =>
  import("../pages/dashboard").then((module) => ({
    default: module.Dashboard,
  }))
);

const Teams = lazy(() =>
  import("../pages/teams").then((module) => ({
    default: module.Teams,
  }))
);

const OrganizationManagement = lazy(() =>
  import("../pages/organization").then((module) => ({
    default: module.OrganizationManagement,
  }))
);

const OrganizationSettingsPage = lazy(() =>
  import("../pages/organization/settings").then((module) => ({
    default: module.OrganizationSettingsPage,
  }))
);

const Reports = lazy(() => import("../pages/reports"));

const Meetings = lazy(() =>
  import("../pages/meetings").then((module) => ({
    default: module.Meetings,
  }))
);

const Settings = lazy(() =>
  import("../pages/settings").then((module) => ({
    default: module.Settings,
  }))
);

const Scrum = lazy(() =>
  import("../pages/scrum").then((module) => ({
    default: module.Scrum,
  }))
);

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream-100">
    <div className="w-8 h-8 border-4 border-forest-900 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const UnderConstruction = ({ title }: { title: string }) => (
  <div className="p-8 text-center space-y-3 bg-cream-50 rounded-2xl border border-cream-200">
    <h2 className="text-xl font-bold text-forest-800">{title}</h2>
    <p className="text-sm text-forest-500">
      This page is under maintenance. Please navigate to Task Management.
    </p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/403",
    element: <Forbidden />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute
        allowedRoles={[
          UserRole.ADMIN,
          UserRole.MANAGER,
          UserRole.EMPLOYEE,
        ]}
      >
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "tasks",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Tasks />
          </Suspense>
        ),
      },
      {
        path: "meetings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Meetings />
          </Suspense>
        ),
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "organization",
        element: (
          <Suspense fallback={<PageLoader />}>
            <OrganizationManagement />
          </Suspense>
        ),
      },
      {
        path: "organization/settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <OrganizationSettingsPage />
          </Suspense>
        ),
      },
      {
        path: "teams",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Teams />
          </Suspense>
        ),
      },
      {
        path: "reports",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Reports />
          </Suspense>
        ),
      },
      {
        path: "notifications",
        element: (
          <UnderConstruction title="Notifications Center" />
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "scrum",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Scrum />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);