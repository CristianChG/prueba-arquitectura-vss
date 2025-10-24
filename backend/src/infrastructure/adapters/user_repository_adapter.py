import uuid
from typing import Optional, List
from domain.entities import User, Role
from domain.repositories import IUserRepository
from infrastructure.database import UserModel, RoleEnum
from infrastructure.database.db_config import db_config


class UserRepositoryAdapter(IUserRepository):
    """User repository adapter using SQLAlchemy."""

    def __init__(self):
        self.db = db_config

    async def find_by_id(self, user_id: str) -> Optional[User]:
        """Find user by ID."""
        session = self.db.get_session()
        try:
            user_model = session.query(UserModel).filter(UserModel.id == user_id).first()
            return self._model_to_entity(user_model) if user_model else None
        finally:
            session.close()

    async def find_by_email(self, email: str) -> Optional[User]:
        """Find user by email."""
        session = self.db.get_session()
        try:
            user_model = session.query(UserModel).filter(UserModel.email == email).first()
            return self._model_to_entity(user_model) if user_model else None
        finally:
            session.close()

    async def create(self, user: User, password_hash: str) -> User:
        """Create a new user."""
        session = self.db.get_session()
        try:
            user_model = UserModel(
                id=user.id or str(uuid.uuid4()),
                email=user.email,
                name=user.name,
                password_hash=password_hash,
                role=RoleEnum(user.role.value)
            )

            session.add(user_model)
            session.commit()
            session.refresh(user_model)

            return self._model_to_entity(user_model)
        finally:
            session.close()

    async def update(self, user: User) -> User:
        """Update existing user."""
        session = self.db.get_session()
        try:
            user_model = session.query(UserModel).filter(UserModel.id == user.id).first()

            if not user_model:
                raise ValueError("User not found")

            user_model.name = user.name
            user_model.email = user.email
            user_model.role = RoleEnum(user.role.value)

            session.commit()
            session.refresh(user_model)

            return self._model_to_entity(user_model)
        finally:
            session.close()

    async def delete(self, user_id: str) -> None:
        """Delete user by ID."""
        session = self.db.get_session()
        try:
            user_model = session.query(UserModel).filter(UserModel.id == user_id).first()

            if user_model:
                session.delete(user_model)
                session.commit()
        finally:
            session.close()

    async def find_all(self) -> List[User]:
        """Get all users."""
        session = self.db.get_session()
        try:
            user_models = session.query(UserModel).all()
            return [self._model_to_entity(model) for model in user_models]
        finally:
            session.close()

    def _model_to_entity(self, model: UserModel) -> User:
        """Convert ORM model to domain entity."""
        return User(
            id=model.id,
            email=model.email,
            name=model.name,
            role=Role(model.role.value),
            created_at=model.created_at,
            updated_at=model.updated_at
        )
