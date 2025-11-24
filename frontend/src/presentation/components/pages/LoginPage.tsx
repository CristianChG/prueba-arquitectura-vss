import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@app/hooks/useAuth";
import { LoginForm } from "@presentation/components/organisms/LoginForm";
import { AuthTemplate } from "@presentation/components/templates/AuthTemplate";
import { APP_ROUTES } from "@constants/AppRoutes";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, isLoading, clearError } = useAuth();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // La navegación se maneja automáticamente por AuthRoute cuando isAuthenticated cambia
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleRegisterClick = () => {
    navigate(APP_ROUTES.REGISTER);
  };

  return (
    <AuthTemplate
      title="Bienvenido"
      subtitle="Accede a tu cuenta"
      footerText="¿No tienes cuenta?"
      footerLinkText="Regístrate aquí"
      onFooterLinkClick={handleRegisterClick}
    >
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error || ""}
      />
    </AuthTemplate>
  );
};
