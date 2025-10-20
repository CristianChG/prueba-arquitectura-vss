import type { IValidationStrategy } from "@validations/IValidationStrategy";
import { REGEX } from "@constants/regex";
import { DATA_TYPES } from "@constants/dataTypes";

export class PasswordValidation implements IValidationStrategy {
  validate(input: unknown): boolean {
    if (typeof input !== DATA_TYPES.STRING) {
      return false;
    }
    return REGEX.PASSWORD.test(input as string);
  }
}
