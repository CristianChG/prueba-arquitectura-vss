from typing import Optional, List, Dict, Any
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

    async def find_all(
        self,
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None,
        role: Optional[int] = None,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get all users with pagination, filters, and sorting."""
        session = self.db.get_session()
        try:
            query = session.query(UserModel)

            # Apply filters
            if search:
                search_pattern = f"%{search}%"
                query = query.filter(
                    (UserModel.name.ilike(search_pattern)) |
                    (UserModel.email.ilike(search_pattern))
                )

            if role is not None:
                query = query.filter(UserModel.role == role)

            # Apply sorting
            if sort_by and sort_order:
                column_map = {
                    'name': UserModel.name,
                    'email': UserModel.email,
                    'role': UserModel.role
                }
                if sort_by in column_map:
                    column = column_map[sort_by]
                    if sort_order.lower() == 'desc':
                        query = query.order_by(column.desc())
                    else:
                        query = query.order_by(column.asc())
            else:
                # Default sorting by name ascending
                query = query.order_by(UserModel.name.asc())

            # Get total count
            total = query.count()

            # Apply pagination
            offset = (page - 1) * limit
            user_models = query.offset(offset).limit(limit).all()

            # Calculate total pages
            pages = (total + limit - 1) // limit if total > 0 else 0

            return {
                'users': [self._model_to_entity(model) for model in user_models],
                'total': total,
                'page': page,
                'limit': limit,
                'pages': pages
            }
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
