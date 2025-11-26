"""Use case for retrieving cows from a specific group in a snapshot."""
from typing import List
from domain.entities import Cow
from domain.repositories import IGlobalHatoRepository


class GetCowsByGroup:
    """Use case for retrieving cows from a specific group in a snapshot."""

    def __init__(self, global_hato_repository: IGlobalHatoRepository):
        self.global_hato_repository = global_hato_repository

    async def execute(self, global_hato_id: int, user_id: int, nombre_grupo: str) -> List[Cow]:
        """
        Execute the use case to get cows for a specific group.

        Args:
            global_hato_id: The snapshot ID
            user_id: User ID for ownership verification
            nombre_grupo: Name of the group

        Returns:
            List of Cow entities
        """
        return await self.global_hato_repository.get_cows_by_group(
            global_hato_id, user_id, nombre_grupo
        )
