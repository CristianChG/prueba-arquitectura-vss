from typing import Protocol


class IValidationStrategy(Protocol):
    """Validation strategy interface following the Strategy pattern."""

    def validate(self, input_value: any) -> bool:
        """Validate input and return True if valid, False otherwise."""
        ...
