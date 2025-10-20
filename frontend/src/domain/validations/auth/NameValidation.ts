import type { IValidationStrategy } from "../IValidationStrategy";
import { REGEX } from "@constants/regex";
import { DATA_TYPES } from "@constants/dataTypes";

export class NameValidation implements IValidationStrategy {
  validate(input: unknown): boolean {
    if (typeof input !== DATA_TYPES.STRING) {
      return false;
    }

    return REGEX.NAME.test(input as string);
  }
}
