import { useNavigate } from "react-router-dom";
import { useAuth } from "@app/hooks/useAuth";
import { LoginForm } from "@presentation/components/organisms/LoginForm";
import { AuthTemplate } from "@presentation/components/templates/AuthTemplate";
import { APP_ROUTES } from "@constants/AppRoutes";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate(APP_ROUTES.DASHBOARD);
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
