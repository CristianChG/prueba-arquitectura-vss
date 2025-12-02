import { useState } from "react";
import { Box } from "@mui/material";
import { AlertBox } from "@molecules/AlertBox";
import { FormField } from "@molecules/FormField";
import { Button } from "@atoms/Button";
import {
  emailValidator,
  loginPasswordValidator,
} from "@domain/factories/AuthValidatorFactory";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  error: initialError,
}) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(initialError || "");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const errors = { email: "", password: "" };

    const emailResult = emailValidator.validate(formData.email);
    if (emailResult.isValid === false) {
      errors.email = emailResult.error as string;
    }

    const loginPasswordResult = loginPasswordValidator.validate(
      formData.password
    );
    if (loginPasswordResult.isValid === false) {
      errors.password = loginPasswordResult.error as string;
    }

    setFieldErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData.email, formData.password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al iniciar sesión. Por favor intenta de nuevo.");
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      {(error || initialError) && (
        <AlertBox
          message={error || initialError || ""}
          severity="error"
          onClose={() => setError("")}
        />
      )}

      <FormField
        label="Correo electrónico"
        error={!!fieldErrors.email}
        helperText={fieldErrors.email}
        inputProps={{
          name: "email",
          value: formData.email,
          onChange: handleChange,
          type: "email",
          placeholder: "juan.perez@example.com",
          disabled: isLoading,
        }}
      />

      <FormField
        label="Contraseña"
        error={!!fieldErrors.password}
        helperText={fieldErrors.password}
        inputProps={{
          name: "password",
          value: formData.password,
          onChange: handleChange,
          type: "password",
          placeholder: "********",
          disabled: isLoading,
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <a href="/forgot-password" style={{ textDecoration: 'none', color: '#1976d2', fontSize: '0.875rem' }}>
          ¿Olvidaste tu contraseña?
        </a>
      </Box>

      <Button
        label={isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        type="submit"
        color="primary"
        isLoading={isLoading}
        variant="contained"
        fullWidth
        disabled={isLoading}
        sx={{
          mt: 2,
          py: 1.5,
          borderRadius: 2,
          textTransform: "none",
          fontSize: "1rem",
        }}
      />
    </Box>
  );
};
