"""Global Hato repository interface."""
from typing import Protocol, Optional, List, Dict, Any
from domain.entities import GlobalHato, Cow


class IGlobalHatoRepository(Protocol):
    """Global Hato repository interface following the Repository pattern."""

    async def create_global_hato(
        self,
        global_hato: GlobalHato,
        cows: List[Cow]
    ) -> GlobalHato:
        """Create a new Global Hato snapshot with associated cows."""
        ...

    async def find_all_by_user(
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
        Get all Global Hato snapshots for a user with pagination, sorting, and filters.

        Returns:
            Dict with 'global_hatos', 'total', 'page', 'limit', 'pages'
        """
        ...

    async def find_by_id(self, global_hato_id: int) -> Optional[GlobalHato]:
        """Find Global Hato snapshot by ID."""
        ...

    async def get_corrales_by_snapshot(self, global_hato_id: int, user_id: int) -> List[Any]:
        """Get aggregated corral data for a snapshot."""
        ...

    async def delete(self, global_hato_id: int, user_id: int) -> None:
        """Delete Global Hato snapshot and all associated cows (with user ownership check)."""
        ...
