import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import { MainLayout } from "../components/layout/MainLayout";
import LandingPage from "../pages/landing/LandingPage";
import LoginPage from "../pages/Auth/LoginPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import Forbidden from "../pages/errors/Forbidden";
import ProtectedRoute from "../components/ProtectedRoute";
import { UserRole } from "../types/roles";
import PageLoader from "../components/loading/PageLoader";

import UpdateProfile from "../pages/updateProfile";
import AddMember from "../pages/addMember";

const Tasks = lazy(() =>
  import("../pages/tasks").then((module) => ({
    default: module.Tasks,
  }))
);

const Projects = lazy(() =>
  import("../pages/projects").then((module) => ({
    default: module.Projects,
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

const UserProfile = lazy(() =>
  import("../pages/userProfile").then((module) => ({
    default: module.UserProfile,
  }))
);

const UserDashboard = lazy(() =>
  import("../pages/userDashboard").then((module) => ({
    default: module.UserDashboard,
  }))
);

const ChangePassword = lazy(() =>
  import("../pages/changePassword").then((module) => ({
    default: module.ChangePassword,
  }))
);

const OrganizationManagement = lazy(() =>
  import("../pages/organization").then((module) => ({
    default: module.OrganizationManagement,
  }))
);

const OrganizationSettings = lazy(() =>
  import("../pages/organization/settings")
);

const ProjectDetails = lazy(() =>
  import("../pages/projects/ProjectDetails").then((module) => ({
    default: module.ProjectDetails,
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
const Notifications = lazy(() =>
  import("../pages/notifications").then((module) => ({
    default: module.default,
  }))
);

const Scrum = lazy(() =>
  import("../pages/scrum").then((module) => ({
    default: module.Scrum,
  }))
);





export const router = createBrowserRouter([

  {
  path: "/",
  element: <LandingPage />,
},


 {
  path: "/login",
  element: <LoginPage />,
},

{
  path: "/forgot-password",
  element: <ForgotPasswordPage />,
},

  {
    path: "/403",
    element: <Forbidden />,
  },
  

{
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
        element: (
          <Suspense fallback={<PageLoader />}>
            <Projects />
          </Suspense>
        ),
      },

      {
        path: "projects/:projectId",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProjectDetails />
          </Suspense>
        ),
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
            <OrganizationSettings />
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
        path: "teams/:id",
        element: (
          <ProtectedRoute
            allowedRoles={[
              UserRole.ADMIN,
              UserRole.MANAGER,
            ]}
          >
            <Suspense fallback={<PageLoader />}>
              <UserProfile />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      {
        path: "add-member",
        element: (
          <ProtectedRoute
            allowedRoles={[
              UserRole.ADMIN,
              UserRole.MANAGER,
            ]}
          >
            <AddMember />
          </ProtectedRoute>
        ),
      },

      {
        path: "update-profile/:id",
        element: (
          <ProtectedRoute
            allowedRoles={[
              UserRole.ADMIN,
              UserRole.MANAGER,
              UserRole.EMPLOYEE,
            ]}
          >
            <Suspense fallback={<PageLoader />}>
              <UpdateProfile />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      {
        path: "user-dashboard",
        element: (
          <ProtectedRoute
            allowedRoles={[
              UserRole.ADMIN,
              UserRole.MANAGER,
              UserRole.EMPLOYEE,
            ]}
          >
            <Suspense fallback={<PageLoader />}>
              <UserDashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      {
        path: "change-password/:id",
        element: (
          <ProtectedRoute
            allowedRoles={[
              UserRole.ADMIN,
              UserRole.MANAGER,
              UserRole.EMPLOYEE,
            ]}
          >
            <Suspense fallback={<PageLoader />}>
              <ChangePassword />
            </Suspense>
          </ProtectedRoute>
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
          <Suspense fallback={<PageLoader />}>
            <Notifications />
          </Suspense>
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