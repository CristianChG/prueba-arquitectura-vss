import { useState } from "react";
import { Box, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { FormField } from "@molecules/FormField";
import { AlertBox } from "@molecules/AlertBox";
import { Button } from "@atoms/Button";
import {
  emailValidator,
  registerPasswordValidator,
  passwordMatchValidator,
  nameValidator,
} from "@factories/AuthValidatorFactory";

interface RegisterFormProps {
  onSubmit: (email: string, password: string, name: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading,
  error: initialError,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState(initialError || "");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    const emailResult = emailValidator.validate(formData.email);
    if (emailResult.isValid === false) {
      errors.email = emailResult.error as string;
    }

    const nameResult = nameValidator.validate(formData.name);
    if (nameResult.isValid === false) {
      errors.name = nameResult.error as string;
    }

    const registerPasswordResult = registerPasswordValidator.validate(
      formData.password
    );
    if (registerPasswordResult.isValid === false) {
      errors.password = registerPasswordResult.error as string;
    }

    const passwordMatchResult = passwordMatchValidator.validate({
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });
    if (passwordMatchResult.isValid === false) {
      errors.password = passwordMatchResult.error as string;
    }

    setFieldErrors(errors);
    return (
      !errors.name &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("Debes aceptar los términos y condiciones para continuar");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData.email, formData.password, formData.name);
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
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}
      >
        Crear Cuenta
      </Typography>

      {(error || initialError) && (
        <AlertBox
          message={error || initialError || ""}
          severity="error"
          onClose={() => setError("")}
        />
      )}

      <FormField
        label="Nombre Completo"
        required
        error={!!fieldErrors.name}
        helperText={fieldErrors.name}
        inputProps={{
          name: "name",
          value: formData.name,
          onChange: handleChange,
          placeholder: "Juan Pérez",
          disabled: isLoading,
        }}
      />

      <FormField
        label="Correo Electrónico"
        required
        error={!!fieldErrors.email}
        helperText={fieldErrors.email}
        inputProps={{
          name: "email",
          value: formData.email,
          onChange: handleChange,
          type: "email",
          placeholder: "usuario@ejemplo.com",
          disabled: isLoading,
        }}
      />

      <FormField
        label="Contraseña"
        required
        error={!!fieldErrors.password}
        helperText={fieldErrors.password}
        inputProps={{
          name: "password",
          value: formData.password,
          onChange: handleChange,
          type: "password",
          placeholder: "Mínimo 8 caracteres (mayúscula, minúscula, número)",
          disabled: isLoading,
        }}
      />

      <FormField
        label="Confirmar Contraseña"
        required
        error={!!fieldErrors.confirmPassword}
        helperText={fieldErrors.confirmPassword}
        inputProps={{
          name: "confirmPassword",
          value: formData.confirmPassword,
          onChange: handleChange,
          type: "password",
          placeholder: "Repite tu contraseña",
          disabled: isLoading,
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            disabled={isLoading}
          />
        }
        label={
          <Typography variant="body2">
            Acepto los{" "}
            <Box
              component="a"
              href="#"
              sx={{ color: "#1976d2", textDecoration: "none", fontWeight: 600 }}
            >
              términos y condiciones
            </Box>
          </Typography>
        }
      />

      <Button
        label={isLoading ? "Registrando..." : "Registrarse"}
        type="submit"
        isLoading={isLoading}
        variant="contained"
        fullWidth
        size="large"
        disabled={isLoading}
        sx={{ mt: 1 }}
      />
    </Box>
  );
};
