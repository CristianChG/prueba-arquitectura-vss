import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthRoute } from "@routes/AuthRoute";
import { ProtectedRoute } from "@routes/ProtectedRoute";
import { LoginPage } from "@pages/LoginPage";
import { RegisterPage } from "@pages/RegisterPage";
import { DashboardPage } from "@pages/DashboardPage";
import { APP_ROUTES } from "@constants/AppRoutes";

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
          path={APP_ROUTES.ROOT}
          element={<Navigate to={APP_ROUTES.DASHBOARD} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};
