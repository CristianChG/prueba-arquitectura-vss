"""Use case for getting all Global Hato snapshots for a user."""
from typing import Dict, Any, Optional
from domain.repositories import IGlobalHatoRepository


class GetAllGlobalHatos:
    """Use case for getting all Global Hato snapshots with pagination and sorting."""

    def __init__(self, global_hato_repository: IGlobalHatoRepository):
        self.global_hato_repository = global_hato_repository

    async def execute(
        self,
        user_id: int,
        page: int = 1,
        limit: int = 10,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = None,
        search: Optional[str] = None,
        fecha_desde: Optional[str] = None,
        fecha_hasta: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Execute get all Global Hatos use case with pagination, sorting, and filters.

        Args:
            user_id: ID of the user
            page: Page number (1-indexed)
            limit: Number of items per page
            sort_by: Field to sort by
            sort_order: Sort order ('asc' or 'desc')
            search: Search query for nombre field
            fecha_desde: Start date filter (ISO format YYYY-MM-DD)
            fecha_hasta: End date filter (ISO format YYYY-MM-DD)

        Returns:
            Dict with 'global_hatos', 'total', 'page', 'limit', 'pages'
        """
        return await self.global_hato_repository.find_all_by_user(
            user_id, page, limit, sort_by, sort_order, search, fecha_desde, fecha_hasta
        )
