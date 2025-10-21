import { useNavigate } from "react-router-dom";
import { useAuth } from "@app/hooks/useAuth";
import { RegisterForm } from "@presentation/components/organisms/RegisterForm";
import { AuthTemplate } from "@presentation/components/templates/AuthTemplate";
import { APP_ROUTES } from "@constants/AppRoutes";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, error, isLoading } = useAuth();

  const handleRegister = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      await register(email, password, name);
      navigate(APP_ROUTES.DASHBOARD);
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleLoginClick = () => {
    navigate(APP_ROUTES.LOGIN);
  };

  return (
    <AuthTemplate
      title="Crear Cuenta"
      subtitle="Únete a nuestro sistema"
      footerText="¿Ya tienes cuenta?"
      footerLinkText="Inicia sesión aquí"
      onFooterLinkClick={handleLoginClick}
    >
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={isLoading}
        error={error || ""}
      />
    </AuthTemplate>
  );
};
