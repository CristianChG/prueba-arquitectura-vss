import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { LoginForm } from "@organisms/LoginForm";
import { APP_ROUTES } from "@constants/AppRoutes";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuth();
  const [formError, setFormError] = useState<string>("");

  const handleLogin = async (email: string, password: string) => {
    setFormError("");
    try {
      await login(email, password);
      navigate(APP_ROUTES.DASHBOARD);
    } catch (err) {
      setFormError(error || "Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      {formError && <div className="error-box">{formError}</div>}
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      <p>
        Don't have an account? <a href={APP_ROUTES.REGISTER}>Register here</a>
      </p>
    </div>
  );
};
