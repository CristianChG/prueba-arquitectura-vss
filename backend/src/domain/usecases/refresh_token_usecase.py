from domain.entities import AuthToken
from domain.repositories import IAuthRepository


class RefreshTokenUseCase:
    """Use case for refreshing authentication tokens."""

    def __init__(self, auth_repository: IAuthRepository):
        self.auth_repository = auth_repository

    async def execute(self, refresh_token: str) -> AuthToken:
        """Execute refresh token use case."""
        if not refresh_token:
            raise ValueError("Refresh token is required")

        return await self.auth_repository.refresh_token(refresh_token)
