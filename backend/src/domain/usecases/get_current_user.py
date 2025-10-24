from domain.entities import User
from domain.repositories import IAuthRepository


class GetCurrentUser:
    """Use case for getting current authenticated user."""

    def __init__(self, auth_repository: IAuthRepository):
        self.auth_repository = auth_repository

    async def execute(self, user_id: str) -> User:
        """Execute get current user use case."""
        if not user_id:
            raise ValueError("User ID is required")

        return await self.auth_repository.get_current_user(user_id)
