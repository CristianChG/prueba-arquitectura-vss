import { useState } from "react";
import { Box, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { FormField } from "@molecules/FormField";
import { AlertBox } from "@molecules/AlertBox";
import { Button } from "@atoms/Button";
import { CheckCircle, Cancel } from "@mui/icons-material";
import {
  emailValidator,
  registerPasswordValidator,
  passwordMatchValidator,
  nameValidator,
} from "@factories/AuthValidatorFactory";
import { APP_CONFIG } from "@constants/appConfig";

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

  // Validaciones individuales de políticas de contraseña
  const passwordPolicies = {
    minLength: formData.password.length >= APP_CONFIG.PASSWORD_MIN_LENGTH,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  };

  // Determinar si hay errores en los campos de contraseña
  const allPasswordPoliciesMet =
    passwordPolicies.minLength &&
    passwordPolicies.hasUppercase &&
    passwordPolicies.hasLowercase &&
    passwordPolicies.hasNumber;

  const passwordHasError = formData.password.length > 0 && !allPasswordPoliciesMet;
  const confirmPasswordHasError =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

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

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <FormField
            label="Contraseña"
            required
            error={!!fieldErrors.password || passwordHasError}
            helperText={fieldErrors.password}
            inputProps={{
              name: "password",
              value: formData.password,
              onChange: handleChange,
              type: "password",
              placeholder: "Ingresa tu contraseña",
              disabled: isLoading,
            }}
          />

          {/* Políticas de contraseña */}
          {formData.password && (
            <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {passwordPolicies.minLength ? (
                  <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                ) : (
                  <Cancel sx={{ fontSize: 16, color: "error.main" }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: passwordPolicies.minLength ? "success.main" : "error.main",
                  }}
                >
                  Mínimo {APP_CONFIG.PASSWORD_MIN_LENGTH} caracteres
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {passwordPolicies.hasUppercase ? (
                  <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                ) : (
                  <Cancel sx={{ fontSize: 16, color: "error.main" }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: passwordPolicies.hasUppercase ? "success.main" : "error.main",
                  }}
                >
                  Al menos una letra mayúscula
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {passwordPolicies.hasLowercase ? (
                  <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                ) : (
                  <Cancel sx={{ fontSize: 16, color: "error.main" }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: passwordPolicies.hasLowercase ? "success.main" : "error.main",
                  }}
                >
                  Al menos una letra minúscula
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {passwordPolicies.hasNumber ? (
                  <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                ) : (
                  <Cancel sx={{ fontSize: 16, color: "error.main" }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: passwordPolicies.hasNumber ? "success.main" : "error.main",
                  }}
                >
                  Al menos un número
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <FormField
            label="Confirmar Contraseña"
            required
            error={!!fieldErrors.confirmPassword || confirmPasswordHasError}
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

          {/* Validación de coincidencia de contraseñas */}
          {formData.confirmPassword && (
            <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
              {formData.password === formData.confirmPassword ? (
                <>
                  <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                  <Typography variant="caption" sx={{ color: "success.main" }}>
                    Las contraseñas coinciden
                  </Typography>
                </>
              ) : (
                <>
                  <Cancel sx={{ fontSize: 16, color: "error.main" }} />
                  <Typography variant="caption" sx={{ color: "error.main" }}>
                    Las contraseñas no coinciden
                  </Typography>
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>

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
        label={isLoading ? "Registrando..." : "Crear cuenta"}
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
