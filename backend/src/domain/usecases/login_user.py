from domain.entities import AuthToken
from domain.repositories import IAuthRepository
from domain.validations import EmailValidation, PasswordValidation


class LoginUser:
    """Use case for user authentication following Clean Architecture."""

    def __init__(self, auth_repository: IAuthRepository):
        self.auth_repository = auth_repository
        self.email_validation = EmailValidation()
        self.password_validation = PasswordValidation()

    async def execute(self, email: str, password: str) -> AuthToken:
        """Execute login use case with validation."""
        if not email or not password:
            raise ValueError("Email and password are required")

        if not self.email_validation.validate(email):
            raise ValueError("Invalid email format")

        if not self.password_validation.validate(password):
            raise ValueError("Invalid password format")

        return await self.auth_repository.login(email, password)
