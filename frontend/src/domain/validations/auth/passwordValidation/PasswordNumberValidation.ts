import type { IValidation } from "@repositories/IValidation";
import type { ValidationResult } from "@entities/ValidationResult";
import { MESSAGES } from "@constants/messages";
import { REGEX } from "@constants/regex";

export class PasswordNumberValidation implements IValidation {
  validate(password: string): ValidationResult {
    if (REGEX.NUMBER.test(password) === false) {
      return {
        isValid: false,
        error: MESSAGES.AUTH.REQUIRED_PASSWORD_NUMBER,
      };
    }
    return { isValid: true };
  }
}
