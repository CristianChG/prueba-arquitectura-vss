import { Navigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import type { Role } from "@constants/roles";
import { ROLES } from "@constants/roles";
import { APP_ROUTES } from "@constants/AppRoutes";

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRole?: Role;
  isPendingApprovalPage?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRole,
  isPendingApprovalPage = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  // Si el usuario tiene rol PENDING_APPROVAL
  if (user?.role === ROLES.PENDING_APPROVAL) {
    // Si está intentando acceder a la página de pending-approval, permitir
    if (isPendingApprovalPage) {
      return element;
    }
    // Si intenta acceder a cualquier otra ruta, redirigir a pending approval
    return <Navigate to={APP_ROUTES.PENDING_APPROVAL} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
  }

  return element;
};
