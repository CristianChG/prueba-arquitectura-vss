import type { IValidation } from "@repositories/IValidation";
import type { ValidationResult } from "@entities/ValidationResult";
import { MESSAGES } from "@constants/messages";

export class PasswordMatchValidation implements IValidation {
  validate(data: {
    password: string;
    confirmPassword: string;
  }): ValidationResult {
    if (data.password !== data.confirmPassword) {
      return {
        isValid: false,
        error: MESSAGES.AUTH.INVALID_PASSWORD_MATCH,
      };
    }
    return { isValid: true };
  }
}
