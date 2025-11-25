"""Use case for deleting a Global Hato snapshot."""
from domain.repositories import IGlobalHatoRepository


class DeleteGlobalHato:
    """Use case for deleting a Global Hato snapshot and its cows."""

    def __init__(self, global_hato_repository: IGlobalHatoRepository):
        self.global_hato_repository = global_hato_repository

    async def execute(self, global_hato_id: int, user_id: int) -> None:
        """
        Execute delete Global Hato use case.

        Args:
            global_hato_id: ID of the Global Hato to delete
            user_id: ID of the user (for ownership verification)

        Raises:
            ValueError: If Global Hato not found or user doesn't own it
        """
        # Verify Global Hato exists and belongs to user
        global_hato = await self.global_hato_repository.find_by_id(global_hato_id)

        if not global_hato:
            raise ValueError("Global Hato not found")

        if global_hato.user_id != user_id:
            raise ValueError("Unauthorized: Global Hato belongs to another user")

        # Delete Global Hato (CASCADE will delete cows)
        await self.global_hato_repository.delete(global_hato_id, user_id)
