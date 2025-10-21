from sqlalchemy import Column, String, DateTime, Integer, Float, JSON, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from infrastructure.database.db_config import Base


class RoleEnum(str, enum.Enum):
    """User role enumeration."""
    ADMIN = "admin"
    USER = "user"
    RESEARCHER = "researcher"


class UserModel(Base):
    """SQLAlchemy ORM model for users."""

    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.USER)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    cows = relationship("CowModel", back_populates="owner", cascade="all, delete-orphan")
    datasets = relationship("DatasetModel", back_populates="uploader", cascade="all, delete-orphan")


class CowModel(Base):
    """SQLAlchemy ORM model for cows."""

    __tablename__ = "cows"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    breed = Column(String, nullable=False)
    birth_date = Column(DateTime, nullable=False)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    health_status = Column(String, nullable=False)
    last_checkup = Column(DateTime, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owner = relationship("UserModel", back_populates="cows")


class DatasetModel(Base):
    """SQLAlchemy ORM model for datasets."""

    __tablename__ = "datasets"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    uploaded_by = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
    # Use 'meta' instead of 'metadata' (reserved by SQLAlchemy)
    meta = Column(JSON, nullable=True)

    # Relationships
    uploader = relationship("UserModel", back_populates="datasets")
    models = relationship("ModelModel", back_populates="dataset", cascade="all, delete-orphan")


class ModelModel(Base):
    """SQLAlchemy ORM model for ML models."""

    __tablename__ = "models"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    version = Column(String, nullable=False)
    model_type = Column(String, nullable=False)
    accuracy = Column(Float, nullable=True)
    dataset_id = Column(String, ForeignKey("datasets.id"), nullable=False)
    trained_by = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    trained_at = Column(DateTime, nullable=True)
    model_path = Column(String, nullable=True)
    parameters = Column(JSON, nullable=True)

    # Relationships
    dataset = relationship("DatasetModel", back_populates="models")
