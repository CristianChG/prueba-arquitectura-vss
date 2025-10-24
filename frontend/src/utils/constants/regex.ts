import { APP_CONFIG } from "@constants/appConfig";

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: new RegExp(`^.{${APP_CONFIG.PASSWORD_MIN_LENGTH},}$`),
  PASSWORD_MAX_LENGTH: new RegExp(`^.{0,${APP_CONFIG.PASSWORD_MAX_LENGTH}}$`),
  UPPER_CASE: /^.*[A-Z].*$/,
  LOWER_CASE: /^.*[a-z].*$/,
  SPECIAL_CHAR: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
  NUMBER: /^.*\d.*$/,
  NAME: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
  PHONE: /^[0-9]{10}$/,
  ZIP_CODE: /^[0-9]{5}$/,
  ONLY_LETTERS: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/,
};
