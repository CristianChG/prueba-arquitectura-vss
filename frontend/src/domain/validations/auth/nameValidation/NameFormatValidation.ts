import type { IValidation } from "@repositories/IValidation";
import type { ValidationResult } from "@entities/ValidationResult";
import { MESSAGES } from "@constants/messages";
import { REGEX } from "@constants/regex";

export class NameFormatValidation implements IValidation {
  validate(name: string): ValidationResult {
    if (REGEX.NAME.test(name.trim()) === false) {
      return {
        isValid: false,
        error: MESSAGES.AUTH.INVALID_NAME,
      };
    }
    return { isValid: true };
  }
}
