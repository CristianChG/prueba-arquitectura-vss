import { APP_CONFIG } from "@constants/appConfig";

export const MESSAGES = {
  AUTH: {
    REQUIRED_FIELDS: "Email and password are required.",
    INVALID_EMAIL: "Please enter a valid email address",
    INVALID_EMAIL_DOMAIN: "Please enter a valid email domain",
    INVALID_EMAIL_LENGTH: `The email cant have more than ${APP_CONFIG.EMAIL_LENGTH} characters`,
    INVALID_PASSWORD: "Please enter a valid password",
    INVALID_PASSWORD_MIN_LENGTH: `Password must be at least ${APP_CONFIG.PASSWORD_MIN_LENGTH} characters long.`,
    INVALID_PASSWORD_MAX_LENGTH: `Password can't be ${APP_CONFIG.PASSWORD_MAX_LENGTH} characters long.`,
    INVALID_PASSWORD_MATCH: "Passwords does not match",
    INVALID_NAME: "Please enter a valid name.",
    INVALID_NAME_MIN_LENGTH: `Name must be at least ${APP_CONFIG.NAME_MIN_LENGTH} characters long.`,
    INVALID_NAME_MAX_LENGTH: `Name can't be ${APP_CONFIG.NAME_MAX_LENGTH} characters long.`,
    INVALID_TOKEN: "The provided token is invalid or has expired.",
    REQUIRED_NAME: "The name is required",
    REQUIRED_EMAIL: "The email is required",
    REQUIRED_PASSWORD: "The password is required",
    REQUIRED_PASSWORD_UPPERCASE:
      "The password must contain at least one uppercase letter",
    REQUIRED_PASSWORD_LOWERCASE:
      "The password must contain at least one lowercase letter",
    REQUIRED_PASSWORD_NUMBER: "The password must contain at least one number",
    REQUIRED_PASSWORD_SPECIAL_CHAR:
      "The password must contain at least one special character",
    REFRESH_TOKEN_MISSING: "Refresh token is required.",
    REGISTRATION_SUCCESS: "Registration successful. You can now log in.",
  },
  CONTEXT: {
    AUTH_CONTEXT_UNDEFINED:
      "Auth context is undefined. Make sure to use within AuthProvider.",
  },
};
