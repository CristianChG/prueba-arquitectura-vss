import type { IValidation } from "@repositories/IValidation";
import type { ValidationResult } from "@entities/ValidationResult";
import { MESSAGES } from "@constants/messages";
import { APP_CONFIG } from "@constants/appConfig";

export class PasswordMaxLengthValidation implements IValidation {
  private readonly maxLength: number;

  constructor(maxLength: number = APP_CONFIG.PASSWORD_MAX_LENGTH) {
    this.maxLength = maxLength;
  }

  validate(password: string): ValidationResult {
    if (password.length > this.maxLength) {
      return {
        isValid: false,
        error: MESSAGES.AUTH.INVALID_PASSWORD_MAX_LENGTH,
      };
    }
    return { isValid: true };
  }
}
