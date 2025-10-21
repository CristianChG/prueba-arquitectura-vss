import type { IValidation } from "@repositories/IValidation";
import type { ICompositeValidation } from "@repositories/ICompositeValidation";
import type { ValidationResult } from "@entities/ValidationResult";

export class CompositeValidation implements ICompositeValidation {
  private validations: IValidation[] = [];

  addValidation(validation: IValidation): this {
    this.validations.push(validation);
    return this;
  }

  validate(value: unknown): ValidationResult {
    for (const validation of this.validations) {
      const result = validation.validate(value);
      if (result.isValid === false) {
        return result;
      }
    }

    return { isValid: true };
  }
}
