import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthRoute } from "@routes/AuthRoute";
import { ProtectedRoute } from "@routes/ProtectedRoute";
import { LoginPage } from "@pages/LoginPage";
import { RegisterPage } from "@pages/RegisterPage";
import { DashboardPage } from "@pages/DashboardPage";
import { UsersPage } from "@pages/UsersPage";
import { NotFoundPage } from "@pages/NotFoundPage";
import { APP_ROUTES } from "@constants/AppRoutes";
import { ROLES } from "@constants/roles";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={APP_ROUTES.LOGIN}
          element={<AuthRoute element={<LoginPage />} />}
        />
        <Route
          path={APP_ROUTES.REGISTER}
          element={<AuthRoute element={<RegisterPage />} />}
        />
        <Route
          path={APP_ROUTES.DASHBOARD}
          element={<ProtectedRoute element={<DashboardPage />} />}
        />
        <Route
          path="/roles"
          element={<ProtectedRoute element={<UsersPage />} requiredRole={ROLES.ADMIN} />}
        />
        <Route
          path={APP_ROUTES.ROOT}
          element={<Navigate to={APP_ROUTES.DASHBOARD} replace />}
        />
        <Route path="*" element={<ProtectedRoute element={<NotFoundPage />} />} />
      </Routes>
    </BrowserRouter>
  );
};
