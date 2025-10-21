import type { IValidation } from "@repositories/IValidation";
import type { ValidationResult } from "@entities/ValidationResult";
import { MESSAGES } from "@constants/messages";
import { APP_CONFIG } from "@constants/appConfig";

export class NameMaxLengthValidation implements IValidation {
  private readonly maxLength: number;

  constructor(maxLength: number = APP_CONFIG.NAME_MAX_LENGTH) {
    this.maxLength = maxLength;
  }

  validate(name: string): ValidationResult {
    if (name.trim().length > this.maxLength) {
      return {
        isValid: false,
        error: MESSAGES.AUTH.INVALID_NAME_MAX_LENGTH,
      };
    }
    return { isValid: true };
  }
}
