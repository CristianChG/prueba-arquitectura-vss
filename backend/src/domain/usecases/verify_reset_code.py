from infrastructure.adapters.auth_repository_adapter import AuthRepositoryAdapter

class VerifyResetCode:
    """Use case for verifying a password reset code."""

    def __init__(self, auth_repository: AuthRepositoryAdapter):
        self.auth_repository = auth_repository

    async def __call__(self, email: str, code: str) -> bool:
        """
        Execute the use case.
        
        Args:
            email: User's email
            code: The reset code to verify
            
        Returns:
            bool: True if valid, False otherwise
        """
        return await self.auth_repository.verify_reset_code(email, code)
