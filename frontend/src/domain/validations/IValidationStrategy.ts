export interface IValidationStrategy {
  validate(input: unknown): boolean;
}
