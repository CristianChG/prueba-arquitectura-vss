import type { ValidationResult } from "@entities/ValidationResult";
import type { IValidation } from "@repositories/IValidation";

export interface ICompositeValidation {
  validate(value: unknown): ValidationResult;
  addValidation(validation: IValidation): this;
}
