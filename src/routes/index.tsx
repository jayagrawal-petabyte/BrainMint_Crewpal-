import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Tasks } from '../pages/tasks';
import { Projects } from '../pages/projects';

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
        element: <Tasks />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'users',
        element: <UnderConstruction title="Team Members" />,
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
