import { Navigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { APP_ROUTES } from "@constants/AppRoutes";
import { ROLES } from "@constants/roles";

interface AuthRouteProps {
  element: React.ReactElement;
}

export const AuthRoute: React.FC<AuthRouteProps> = ({ element }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    // Si el usuario tiene rol PENDING_APPROVAL, redirigir a la página de aprobación pendiente
    if (user?.role === ROLES.PENDING_APPROVAL) {
      return <Navigate to={APP_ROUTES.PENDING_APPROVAL} replace />;
    }
    return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
  }

  return element;
};
