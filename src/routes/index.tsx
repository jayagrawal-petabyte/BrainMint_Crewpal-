import Login from "../pages/login";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { Tasks } from "../pages/tasks";
import Forbidden from "../pages/errors/Forbidden";
import ProtectedRoute from "../components/ProtectedRoute";
import { UserRole } from "../types/roles";

export const AppRoutes = () => {
  return (
    <Routes>

      {/* Login Page */}
      <Route path="/login" element={<Login />} />

      {/* Error Page */}
      <Route path="/403" element={<Forbidden />} />

      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        <Route
          path="/tasks"
          element={
            <ProtectedRoute
              allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}
            >
              <Tasks />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Route>

    </Routes>
  );
};