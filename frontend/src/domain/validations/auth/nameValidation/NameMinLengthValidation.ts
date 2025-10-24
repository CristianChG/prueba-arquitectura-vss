import type { IValidation } from "@repositories/IValidation";
import type { ValidationResult } from "@entities/ValidationResult";
import { MESSAGES } from "@constants/messages";
import { APP_CONFIG } from "@constants/appConfig";

export class NameMinLengthValidation implements IValidation {
  private readonly minLength: number;

  constructor(minLength: number = APP_CONFIG.NAME_MIN_LENGTH) {
    this.minLength = minLength;
  }

  validate(name: string): ValidationResult {
    if (name.trim().length < this.minLength) {
      return {
        isValid: false,
        error: MESSAGES.AUTH.INVALID_NAME_MIN_LENGTH,
      };
    }
    return { isValid: true };
  }
}
