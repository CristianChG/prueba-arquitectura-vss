import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Optional
from domain.entities import User, AuthToken
from domain.repositories import IAuthRepository
from infrastructure.database import UserModel
from infrastructure.database.db_config import db_config
from utils.constants.roles import ROLE_PENDING_APPROVAL
from utils.constants.messages import AuthMessages
import os


class AuthRepositoryAdapter(IAuthRepository):
    """Authentication repository adapter using SQLAlchemy."""

    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    REFRESH_TOKEN_EXPIRE_DAYS = 7

    def __init__(self):
        self.db = db_config

        # Fail fast if JWT_SECRET_KEY is not set
        self.SECRET_KEY = os.getenv("JWT_SECRET_KEY")
        if not self.SECRET_KEY:
            raise ValueError(
                "JWT_SECRET_KEY environment variable is required!\n\n"
                "Please set it in your .env file in the root directory.\n"
                "Example: JWT_SECRET_KEY=your-super-secret-key-min-32-characters\n\n"
                "SECURITY: Use a strong random string for production!\n"
                "Generate one: python -c 'import secrets; print(secrets.token_urlsafe(32))'"
            )

    async def login(self, email: str, password: str) -> AuthToken:
        """Authenticate user and return tokens."""
        session = self.db.get_session()
        try:
            user_model = session.query(UserModel).filter(UserModel.email == email).first()

            if not user_model:
                raise ValueError(AuthMessages.INVALID_CREDENTIALS)

            # Verify password
            if not bcrypt.checkpw(password.encode('utf-8'), user_model.password.encode('utf-8')):
                raise ValueError(AuthMessages.INVALID_CREDENTIALS)

            # Generate tokens
            access_token = self._create_access_token(user_model.id)
            refresh_token = self._create_refresh_token(user_model.id)

            return AuthToken(
                access_token=access_token,
                refresh_token=refresh_token
            )
        finally:
            session.close()

    async def register(self, email: str, password: str, name: str) -> User:
        """Register a new user."""
        session = self.db.get_session()
        try:
            # Check if user exists
            existing_user = session.query(UserModel).filter(UserModel.email == email).first()
            if existing_user:
                raise ValueError(AuthMessages.USER_EXISTS)

            # Hash password
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            # Create user (id is auto-increment, no need to set it)
            user_model = UserModel(
                email=email,
                name=name,
                password=password_hash,
                role=ROLE_PENDING_APPROVAL
            )

            session.add(user_model)
            session.commit()
            session.refresh(user_model)

            return self._model_to_entity(user_model)
        finally:
            session.close()

    async def logout(self, user_id: int) -> None:
        """Logout user (invalidate tokens - implement token blacklist if needed)."""
        # In a production system, you would add the token to a blacklist
        pass

    async def refresh_token(self, refresh_token: str) -> AuthToken:
        """Generate new access token from refresh token."""
        try:
            payload = jwt.decode(refresh_token, self.SECRET_KEY, algorithms=[self.ALGORITHM])
            user_id = payload.get("sub")

            if not user_id:
                raise ValueError(AuthMessages.INVALID_TOKEN)

            # Generate new tokens
            access_token = self._create_access_token(user_id)
            new_refresh_token = self._create_refresh_token(user_id)

            return AuthToken(
                access_token=access_token,
                refresh_token=new_refresh_token
            )
        except jwt.ExpiredSignatureError:
            raise ValueError(AuthMessages.TOKEN_EXPIRED)
        except jwt.InvalidTokenError:
            raise ValueError(AuthMessages.INVALID_TOKEN)

    async def verify_token(self, token: str) -> dict:
        """Verify and decode JWT token."""
        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            raise ValueError(AuthMessages.TOKEN_EXPIRED)
        except jwt.InvalidTokenError:
            raise ValueError(AuthMessages.INVALID_TOKEN)

    async def get_current_user(self, user_id: int) -> User:
        """Get current authenticated user."""
        session = self.db.get_session()
        try:
            user_model = session.query(UserModel).filter(UserModel.id == user_id).first()

            if not user_model:
                raise ValueError(AuthMessages.USER_NOT_FOUND)

            return self._model_to_entity(user_model)
        finally:
            session.close()

    def _create_access_token(self, user_id: int) -> str:
        """Create JWT access token."""
        expire = datetime.utcnow() + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)
        payload = {
            "sub": user_id,
            "exp": expire,
            "type": "access"
        }
        return jwt.encode(payload, self.SECRET_KEY, algorithm=self.ALGORITHM)

    def _create_refresh_token(self, user_id: int) -> str:
        """Create JWT refresh token."""
        expire = datetime.utcnow() + timedelta(days=self.REFRESH_TOKEN_EXPIRE_DAYS)
        payload = {
            "sub": user_id,
            "exp": expire,
            "type": "refresh"
        }
        return jwt.encode(payload, self.SECRET_KEY, algorithm=self.ALGORITHM)

    def _model_to_entity(self, model: UserModel) -> User:
        """Convert ORM model to domain entity."""
        return User(
            id=model.id,
            name=model.name,
            email=model.email,
            password=model.password,
            role=model.role
        )
