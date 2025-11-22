from typing import Protocol, Optional, List, Dict, Any
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

    async def find_all(
        self,
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None,
        role: Optional[int] = None,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get all users with pagination, filters, and sorting.

        Args:
            sort_by: Column to sort by ('name', 'email', 'role')
            sort_order: Sort order ('asc' or 'desc')

        Returns:
            Dict with 'users', 'total', 'page', 'limit', 'pages'
        """
        ...
