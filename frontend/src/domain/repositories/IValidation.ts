import type { ValidationResult } from "@entities/ValidationResult";

export interface IValidation {
  validate(input: unknown): ValidationResult;
}
