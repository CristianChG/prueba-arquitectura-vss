from typing import Protocol, Optional, List
from domain.entities import User


class IUserRepository(Protocol):
    """User repository interface following the Repository pattern."""

    async def find_by_id(self, user_id: str) -> Optional[User]:
        """Find user by ID."""
        ...

    async def find_by_email(self, email: str) -> Optional[User]:
        """Find user by email."""
        ...

    async def create(self, user: User, password_hash: str) -> User:
        """Create a new user."""
        ...

    async def update(self, user: User) -> User:
        """Update existing user."""
        ...

    async def delete(self, user_id: str) -> None:
        """Delete user by ID."""
        ...

    async def find_all(self) -> List[User]:
        """Get all users."""
        ...
