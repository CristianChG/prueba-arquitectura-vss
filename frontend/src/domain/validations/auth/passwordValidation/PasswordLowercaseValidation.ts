import type { IValidation } from "@repositories/IValidation";
import type { ValidationResult } from "@entities/ValidationResult";
import { MESSAGES } from "@constants/messages";
import { REGEX } from "@constants/regex";

export class PasswordLowercaseValidation implements IValidation {
  validate(password: string): ValidationResult {
    if (REGEX.LOWER_CASE.test(password) === false) {
      return {
        isValid: false,
        error: MESSAGES.AUTH.REQUIRED_PASSWORD_LOWERCASE,
      };
    }
    return { isValid: true };
  }
}
