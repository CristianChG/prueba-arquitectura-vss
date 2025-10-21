import type { IValidation } from "@repositories/IValidation";
import type { ValidationResult } from "@entities/ValidationResult";
import { MESSAGES } from "@constants/messages";

export class NameRequiredValidation implements IValidation {
  validate(name: string): ValidationResult {
    if (!name || name.trim() === null) {
      return {
        isValid: false,
        error: MESSAGES.AUTH.REQUIRED_NAME,
      };
    }
    return { isValid: true };
  }
}
