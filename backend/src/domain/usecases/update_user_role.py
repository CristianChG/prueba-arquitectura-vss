from domain.entities import User
from domain.repositories import IUserRepository
from utils.constants.roles import ROLE_ADMIN, ROLE_COLAB, ROLE_PENDING_APPROVAL


class UpdateUserRole:
    """Use case for updating a user's role."""

    def __init__(self, user_repository: IUserRepository):
        self.user_repository = user_repository

    async def execute(self, user_id: int, new_role: int) -> User:
        """Execute update user role use case."""
        # Validate role
        if new_role not in [ROLE_ADMIN, ROLE_COLAB, ROLE_PENDING_APPROVAL]:
            raise ValueError(f"Invalid role: {new_role}")

        # Get existing user
        user = await self.user_repository.find_by_id(user_id)
        if not user:
            raise ValueError(f"User with ID {user_id} not found")

        # Update role
        user.role = new_role

        # Save changes
        return await self.user_repository.update(user)
