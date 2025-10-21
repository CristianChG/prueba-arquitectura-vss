import type { IValidation } from "@repositories/IValidation";
import type { ValidationResult } from "@entities/ValidationResult";
import { MESSAGES } from "@constants/messages";

export class EmailRequiredValidation implements IValidation {
  validate(email: string): ValidationResult {
    if (!email || email.trim() === null) {
      return {
        isValid: false,
        error: MESSAGES.AUTH.REQUIRED_EMAIL,
      };
    }
    return { isValid: true };
  }
}
