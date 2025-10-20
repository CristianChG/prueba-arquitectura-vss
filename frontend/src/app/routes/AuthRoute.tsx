import { Navigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { APP_ROUTES } from "@constants/AppRoutes";

interface AuthRouteProps {
  element: React.ReactElement;
}

export const AuthRoute: React.FC<AuthRouteProps> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
  }

  return element;
};
