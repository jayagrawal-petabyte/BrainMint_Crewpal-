import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Projects } from '../pages/projects';

// Lazy loaded routes for code splitting (Day 29 Performance)
const Tasks = lazy(() => import('../pages/tasks').then(module => ({ default: module.Tasks })));
const Dashboard = lazy(() => import('../pages/dashboard').then(module => ({ default: module.Dashboard })));
const Teams = lazy(() => import('../pages/teams').then(module => ({ default: module.Teams })));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream-100">
    <div className="w-8 h-8 border-4 border-forest-900 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Placeholder view for secondary routes not yet in scope for our module
const UnderConstruction = ({ title }: { title: string }) => (
  <div className="p-8 text-center space-y-3 bg-cream-50 rounded-2xl border border-cream-200">
    <h2 className="text-xl font-bold text-forest-800">{title}</h2>
    <p className="text-sm text-forest-500">This page is under maintenance. Please navigate to Task Management.</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/tasks" replace />,
      },
      {
        path: 'tasks',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Tasks />
          </Suspense>
        ),
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'teams',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Teams />
          </Suspense>
        ),
      },
      {
        path: 'reports',
        element: <UnderConstruction title="Analytics & Reports" />,
      },
      {
        path: 'notifications',
        element: <UnderConstruction title="Notifications Center" />,
      },
      {
        path: '*',
        element: <Navigate to="/tasks" replace />,
      },
    ],
  },
]);
