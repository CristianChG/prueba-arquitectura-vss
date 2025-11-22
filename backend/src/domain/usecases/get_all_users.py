from typing import Dict, Any, Optional
from domain.repositories import IUserRepository


class GetAllUsers:
    """Use case for getting all users with pagination and filters."""

    def __init__(self, user_repository: IUserRepository):
        self.user_repository = user_repository

    async def execute(
        self,
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None,
        role: Optional[int] = None,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = None
    ) -> Dict[str, Any]:
        """Execute get all users use case with pagination, filters, and sorting."""
        return await self.user_repository.find_all(page, limit, search, role, sort_by, sort_order)
