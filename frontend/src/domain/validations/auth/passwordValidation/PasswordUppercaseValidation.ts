import type { IValidation } from "@repositories/IValidation";
import type { ValidationResult } from "@entities/ValidationResult";
import { MESSAGES } from "@constants/messages";
import { REGEX } from "@constants/regex";

export class PasswordUppercaseValidation implements IValidation {
  validate(password: string): ValidationResult {
    if (REGEX.UPPER_CASE.test(password) === false) {
      return {
        isValid: false,
        error: MESSAGES.AUTH.REQUIRED_PASSWORD_UPPERCASE,
      };
    }
    return { isValid: true };
  }
}
