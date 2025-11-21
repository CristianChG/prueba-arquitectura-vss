from typing import Optional, List
from domain.entities import User
from domain.repositories import IUserRepository
from infrastructure.database import UserModel
from infrastructure.database.db_config import db_config


class UserRepositoryAdapter(IUserRepository):
    """User repository adapter using SQLAlchemy."""

    def __init__(self):
        self.db = db_config

    async def find_by_id(self, user_id: int) -> Optional[User]:
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
                email=user.email,
                name=user.name,
                password=password_hash,
                role=user.role
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
            user_model.role = user.role

            session.commit()
            session.refresh(user_model)

            return self._model_to_entity(user_model)
        finally:
            session.close()

    async def delete(self, user_id: int) -> None:
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
            name=model.name,
            email=model.email,
            password=model.password,
            role=model.role
        )
