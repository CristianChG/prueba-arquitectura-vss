import type { IValidation } from "@repositories/IValidation";
import type { ValidationResult } from "@entities/ValidationResult";
import { MESSAGES } from "@constants/messages";
import { REGEX } from "@constants/regex";

export class EmailFormatValidation implements IValidation {
  validate(email: string): ValidationResult {
    if (!REGEX.EMAIL.test(email)) {
      return {
        isValid: false,
        error: MESSAGES.AUTH.INVALID_EMAIL,
      };
    }
    return { isValid: true };
  }
}
