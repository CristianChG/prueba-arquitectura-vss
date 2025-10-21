from domain.validations.i_validation_strategy import IValidationStrategy


class NameValidation(IValidationStrategy):
    """Name validation strategy."""

    MIN_LENGTH = 2
    MAX_LENGTH = 100

    def validate(self, input_value: any) -> bool:
        """Validate name format."""
        if not isinstance(input_value, str):
            return False

        # Remove extra whitespace and check length
        name = input_value.strip()
        if len(name) < self.MIN_LENGTH or len(name) > self.MAX_LENGTH:
            return False

        # Name should contain only letters, spaces, hyphens, and apostrophes
        return all(c.isalpha() or c in " -'" for c in name)
