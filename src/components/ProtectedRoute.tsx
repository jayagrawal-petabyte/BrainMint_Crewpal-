import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../types/roles";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles: UserRole[];
};

const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user } = useAuth();

  // Not logged in
if (!user) {
  return <Navigate to="/login" replace />;
}

  // Logged in but doesn't have permission
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  // Authorized
  return <>{children}</>;
};

export default ProtectedRoute;