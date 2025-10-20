import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { RegisterForm } from "@organisms/RegisterForm";
import { APP_ROUTES } from "@constants/AppRoutes";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, error, isLoading } = useAuth();
  const [formError, setFormError] = useState<string>("");

  const handleRegister = async (
    email: string,
    password: string,
    name: string
  ) => {
    setFormError("");
    try {
      await register(email, password, name);
      navigate(APP_ROUTES.DASHBOARD);
    } catch (err) {
      setFormError(error || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      {formError && <div className="error-box">{formError}</div>}
      <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
      <p>
        Already have an account? <a href={APP_ROUTES.LOGIN}>Login here</a>
      </p>
    </div>
  );
};
