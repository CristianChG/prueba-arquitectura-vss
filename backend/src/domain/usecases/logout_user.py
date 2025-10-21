from domain.repositories import IAuthRepository


class LogoutUser:
    """Use case for user logout following Clean Architecture."""

    def __init__(self, auth_repository: IAuthRepository):
        self.auth_repository = auth_repository

    async def execute(self, user_id: str) -> None:
        """Execute logout use case."""
        if not user_id:
            raise ValueError("User ID is required")

        await self.auth_repository.logout(user_id)
