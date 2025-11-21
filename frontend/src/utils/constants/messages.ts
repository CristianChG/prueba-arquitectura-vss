import { APP_CONFIG } from "@constants/appConfig";

export const MESSAGES = {
  AUTH: {
    REQUIRED_FIELDS: "El correo electrónico y la contraseña son requeridos.",
    INVALID_EMAIL: "Por favor ingresa un correo electrónico válido",
    INVALID_EMAIL_DOMAIN: "Por favor ingresa un dominio de correo válido",
    INVALID_EMAIL_LENGTH: `El correo no puede tener más de ${APP_CONFIG.EMAIL_LENGTH} caracteres`,
    INVALID_PASSWORD: "Por favor ingresa una contraseña válida",
    INVALID_PASSWORD_MIN_LENGTH: `La contraseña debe tener al menos ${APP_CONFIG.PASSWORD_MIN_LENGTH} caracteres.`,
    INVALID_PASSWORD_MAX_LENGTH: `La contraseña no puede tener más de ${APP_CONFIG.PASSWORD_MAX_LENGTH} caracteres.`,
    INVALID_PASSWORD_MATCH: "Las contraseñas no coinciden",
    INVALID_NAME: "Por favor ingresa un nombre válido.",
    INVALID_NAME_MIN_LENGTH: `El nombre debe tener al menos ${APP_CONFIG.NAME_MIN_LENGTH} caracteres.`,
    INVALID_NAME_MAX_LENGTH: `El nombre no puede tener más de ${APP_CONFIG.NAME_MAX_LENGTH} caracteres.`,
    INVALID_TOKEN: "El token proporcionado es inválido o ha expirado.",
    REQUIRED_NAME: "El nombre es requerido",
    REQUIRED_EMAIL: "El correo electrónico es requerido",
    REQUIRED_PASSWORD: "La contraseña es requerida",
    REQUIRED_PASSWORD_UPPERCASE:
      "La contraseña debe contener al menos una letra mayúscula",
    REQUIRED_PASSWORD_LOWERCASE:
      "La contraseña debe contener al menos una letra minúscula",
    REQUIRED_PASSWORD_NUMBER: "La contraseña debe contener al menos un número",
    REQUIRED_PASSWORD_SPECIAL_CHAR:
      "La contraseña debe contener al menos un carácter especial",
    REFRESH_TOKEN_MISSING: "El token de actualización es requerido.",
    REGISTRATION_SUCCESS: "Registro exitoso. Ahora puedes iniciar sesión.",
  },
  CONTEXT: {
    AUTH_CONTEXT_UNDEFINED:
      "El contexto de autenticación no está definido. Asegúrate de usarlo dentro de AuthProvider.",
  },
};
