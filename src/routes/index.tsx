import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Tasks } from '../pages/tasks';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/tasks" element={<Tasks />} />
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Route>
    </Routes>
  );
};
