import type { IValidation } from "@repositories/IValidation";
import type { ValidationResult } from "@entities/ValidationResult";
import { MESSAGES } from "@constants/messages";
import { APP_CONFIG } from "@constants/appConfig";

export class PasswordMinLengthValidation implements IValidation {
  private readonly minLength: number;

  constructor(minLength: number = APP_CONFIG.PASSWORD_MIN_LENGTH) {
    this.minLength = minLength;
  }

  validate(password: string): ValidationResult {
    if (password.length < this.minLength) {
      return {
        isValid: false,
        error: MESSAGES.AUTH.INVALID_PASSWORD_MIN_LENGTH,
      };
    }
    return { isValid: true };
  }
}
