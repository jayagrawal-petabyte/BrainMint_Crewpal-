import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Dashboard } from '../pages/dashboard';
import { Projects } from '../pages/projects';
import { Tasks } from '../pages/tasks';
import { Teams } from '../pages/users';
import { Reports } from '../pages/reports';
import { Chats } from '../pages/notifications';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/calendar" element={<Teams />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
