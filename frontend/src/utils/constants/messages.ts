export const MESSAGES = {
  AUTH: {
    REQUIRED_FIELDS: "Email and password are required.",
    INVALID_EMAIL: "Please enter a valid email address.",
    INVALID_PASSWORD:
      "Password must be at least 8 characters long and contain both letters and numbers.",
    REGISTRATION_SUCCESS: "Registration successful. You can now log in.",
    INVALID_NAME:
      "Name must be between 2 and 50 characters and contain only letters and spaces.",
    REFRESH_TOKEN_MISSING: "Refresh token is required.",
    INVALID_TOKEN: "The provided token is invalid or has expired.",
  },
  CONTEXT: {
    AUTH_CONTEXT_UNDEFINED:
      "Auth context is undefined. Make sure to use within AuthProvider.",
  },
};
