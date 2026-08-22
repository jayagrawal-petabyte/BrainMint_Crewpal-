import type { ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types/roles";

type SelfOnlyRouteProps = {
  children: ReactNode;
};

/**
 * SelfOnlyRoute — BUG-04 fix
 *
 * Allows ADMIN and MANAGER roles to access any user's profile/password route.
 * Restricts EMPLOYEE users so they can only access routes where the :id
 * parameter matches their own user ID.
 *
 * Must be nested inside a <ProtectedRoute> (which already verifies login).
 */
const SelfOnlyRoute = ({ children }: SelfOnlyRouteProps) => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  // If no user (shouldn't happen — ProtectedRoute handles this), redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ADMIN and MANAGER can access any profile
  if (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER) {
    return <>{children}</>;
  }

  // EMPLOYEE can only access their own profile/password
  if (id && id !== user.id) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default SelfOnlyRoute;
