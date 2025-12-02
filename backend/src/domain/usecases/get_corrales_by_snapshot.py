"""Use case for retrieving aggregated corral data from a snapshot."""
from typing import List
from domain.entities import CorralGroup
from domain.repositories import IGlobalHatoRepository


class GetCorralesBySnapshot:
    """Use case for retrieving aggregated corral data from a snapshot."""

    def __init__(self, global_hato_repository: IGlobalHatoRepository):
        self.global_hato_repository = global_hato_repository

    async def execute(self, global_hato_id: int, user_id: int) -> List[CorralGroup]:
        """
        Execute the use case to get corral groups for a snapshot.

        Args:
            global_hato_id: The snapshot ID
            user_id: User ID for ownership verification

        Returns:
            List of CorralGroup entities
        """
        return await self.global_hato_repository.get_corrales_by_snapshot(
            global_hato_id, user_id
        )
