"""Use case for retrieving all cows from a snapshot with pagination and filtering."""
from typing import Dict, Any, Optional
from domain.repositories import IGlobalHatoRepository


class GetAllCowsBySnapshot:
    """Use case for retrieving all cows from a snapshot with pagination, sorting, and filtering."""

    def __init__(self, global_hato_repository: IGlobalHatoRepository):
        self.global_hato_repository = global_hato_repository

    async def execute(
        self,
        global_hato_id: int,
        user_id: int,
        page: int = 1,
        limit: int = 10,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = None,
        search: Optional[str] = None,
        nombre_grupo: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Execute the use case to get all cows for a snapshot.

        Args:
            global_hato_id: The snapshot ID
            user_id: User ID for ownership verification
            page: Page number for pagination
            limit: Number of items per page
            sort_by: Column to sort by
            sort_order: Sort direction ('asc' or 'desc')
            search: Search query for partial matching
            nombre_grupo: Filter by group name

        Returns:
            Dict with 'cows' (list) and 'pagination' (metadata)
        """
        return await self.global_hato_repository.get_all_cows_by_snapshot(
            global_hato_id,
            user_id,
            page,
            limit,
            sort_by,
            sort_order,
            search,
            nombre_grupo
        )
