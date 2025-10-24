from domain.validations.i_validation_strategy import IValidationStrategy


class PasswordValidation(IValidationStrategy):
    """Password validation strategy."""

    MIN_LENGTH = 8
    MAX_LENGTH = 128

    def validate(self, input_value: any) -> bool:
        """Validate password meets security requirements."""
        if not isinstance(input_value, str):
            return False

        if len(input_value) < self.MIN_LENGTH or len(input_value) > self.MAX_LENGTH:
            return False

        # Check for at least one uppercase, one lowercase, and one digit
        has_upper = any(c.isupper() for c in input_value)
        has_lower = any(c.islower() for c in input_value)
        has_digit = any(c.isdigit() for c in input_value)

        return has_upper and has_lower and has_digit
