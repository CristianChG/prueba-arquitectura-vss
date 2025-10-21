from typing import Protocol
from domain.entities import User, AuthToken


class IAuthRepository(Protocol):
    """Authentication repository interface following the Repository pattern."""

    async def login(self, email: str, password: str) -> AuthToken:
        """Authenticate user and return tokens."""
        ...

    async def register(self, email: str, password: str, name: str) -> User:
        """Register a new user."""
        ...

    async def logout(self, user_id: str) -> None:
        """Logout user and invalidate tokens."""
        ...

    async def refresh_token(self, refresh_token: str) -> AuthToken:
        """Generate new access token from refresh token."""
        ...

    async def verify_token(self, token: str) -> dict:
        """Verify and decode JWT token."""
        ...

    async def get_current_user(self, user_id: str) -> User:
        """Get current authenticated user."""
        ...
