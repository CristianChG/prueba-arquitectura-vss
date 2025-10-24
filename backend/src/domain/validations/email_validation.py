import re
from domain.validations.i_validation_strategy import IValidationStrategy


class EmailValidation(IValidationStrategy):
    """Email validation using regex pattern."""

    EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

    def validate(self, input_value: any) -> bool:
        """Validate email format."""
        if not isinstance(input_value, str):
            return False
        return bool(self.EMAIL_REGEX.match(input_value))
