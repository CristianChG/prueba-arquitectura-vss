from domain.entities import User
from domain.repositories import IAuthRepository
from domain.validations import EmailValidation, PasswordValidation, NameValidation


class RegisterUser:
    """Use case for user registration following Clean Architecture."""

    def __init__(self, auth_repository: IAuthRepository):
        self.auth_repository = auth_repository
        self.email_validation = EmailValidation()
        self.password_validation = PasswordValidation()
        self.name_validation = NameValidation()

    async def execute(self, email: str, password: str, name: str) -> User:
        """Execute registration use case with validation."""
        if not email or not password or not name:
            raise ValueError("Email, password, and name are required")

        if not self.email_validation.validate(email):
            raise ValueError("Invalid email format")

        if not self.password_validation.validate(password):
            raise ValueError(
                "Password must be 8-128 characters with uppercase, lowercase, and digit"
            )

        if not self.name_validation.validate(name):
            raise ValueError("Invalid name format")

        return await self.auth_repository.register(email, password, name)
