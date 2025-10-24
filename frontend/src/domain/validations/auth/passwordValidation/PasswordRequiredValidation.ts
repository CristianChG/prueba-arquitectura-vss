import type { IValidation } from "@repositories/IValidation";
import type { ValidationResult } from "@entities/ValidationResult";
import { MESSAGES } from "@constants/messages";

export class PasswordRequiredValidation implements IValidation {
  validate(password: string): ValidationResult {
    if (!password || password.trim() === null) {
      return {
        isValid: false,
        error: MESSAGES.AUTH.REQUIRED_PASSWORD,
      };
    }
    return { isValid: true };
  }
}
