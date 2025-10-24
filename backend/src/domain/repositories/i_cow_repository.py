from typing import Protocol, Optional, List
from domain.entities import Cow


class ICowRepository(Protocol):
    """Cow repository interface following the Repository pattern."""

    async def find_by_id(self, cow_id: str) -> Optional[Cow]:
        """Find cow by ID."""
        ...

    async def find_by_owner(self, owner_id: str) -> List[Cow]:
        """Find all cows owned by a specific user."""
        ...

    async def create(self, cow: Cow) -> Cow:
        """Create a new cow record."""
        ...

    async def update(self, cow: Cow) -> Cow:
        """Update existing cow."""
        ...

    async def delete(self, cow_id: str) -> None:
        """Delete cow by ID."""
        ...

    async def find_all(self) -> List[Cow]:
        """Get all cows."""
        ...

    async def find_by_health_status(self, status: str) -> List[Cow]:
        """Find cows by health status."""
        ...
