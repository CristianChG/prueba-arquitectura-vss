import type { IValidation } from "@repositories/IValidation";
import type { ValidationResult } from "@entities/ValidationResult";
import { MESSAGES } from "@constants/messages";
import { APP_CONFIG } from "@constants/appConfig";

export class EmailLengthValidation implements IValidation {
  private readonly maxLength: number;

  constructor(maxLength: number = APP_CONFIG.EMAIL_LENGTH) {
    this.maxLength = maxLength;
  }

  validate(email: string): ValidationResult {
    if (email.length > this.maxLength) {
      return {
        isValid: false,
        error: MESSAGES.AUTH.INVALID_EMAIL_LENGTH,
      };
    }
    return { isValid: true };
  }
}
