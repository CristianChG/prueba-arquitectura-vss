import { Navigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import type { Role } from "@constants/roles";
import { APP_ROUTES } from "@constants/AppRoutes";

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRole?: Role;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
  }

  return element;
};
