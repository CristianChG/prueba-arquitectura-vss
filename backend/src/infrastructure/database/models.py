from sqlalchemy import Column, String, DateTime, Integer, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from infrastructure.database.db_config import Base


class UserModel(Base):
    """SQLAlchemy ORM model for users."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    role = Column(Integer, nullable=False, default=3)  # 1=ADMIN, 2=COLAB, 3=PENDING_APPROVAL
    reset_code = Column(String, nullable=True)
    reset_code_expires = Column(DateTime, nullable=True)

    # Relationships
    global_hatos = relationship("GlobalHatoModel", back_populates="uploader", cascade="all, delete-orphan")
    datasets = relationship("DatasetModel", back_populates="uploader", cascade="all, delete-orphan")
    models = relationship("ModelModel", back_populates="uploader", cascade="all, delete-orphan")
    predictions = relationship("PredictionModel", back_populates="user", cascade="all, delete-orphan")


class GlobalHatoModel(Base):
    """SQLAlchemy ORM model for Global Hato snapshots."""

    __tablename__ = "global_hato"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    nombre = Column(String, nullable=False)
    fecha_snapshot = Column(DateTime, nullable=False)
    total_animales = Column(Integer, nullable=False)
    grupos_detectados = Column(Integer, nullable=False)
    blob_route = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    # Relationships
    uploader = relationship("UserModel", back_populates="global_hatos")
    cows = relationship("CowModel", back_populates="global_hato", cascade="all, delete-orphan")


class CowModel(Base):
    """SQLAlchemy ORM model for cows with Global Hato snapshot fields."""

    __tablename__ = "cows"

    id = Column(Integer, primary_key=True, autoincrement=True)
    global_hato_id = Column(Integer, ForeignKey("global_hato.id"), nullable=True)
    numero_animal = Column(String, nullable=True)
    nombre_grupo = Column(String, nullable=True)
    produccion_leche_ayer = Column(Integer, nullable=True)  # Using Integer for NUMERIC
    produccion_media_7dias = Column(Integer, nullable=True)
    estado_reproduccion = Column(String, nullable=True)
    dias_ordeno = Column(Integer, nullable=True)
    numero_seleccion = Column(String, nullable=True)
    recomendacion = Column(Integer, nullable=True)

    # Relationships
    global_hato = relationship("GlobalHatoModel", back_populates="cows")
    datasets = relationship("DatasetModel", back_populates="cow", cascade="all, delete-orphan")
    predictions = relationship("PredictionModel", back_populates="cow", cascade="all, delete-orphan")


class DatasetModel(Base):
    """SQLAlchemy ORM model for datasets."""

    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cow_id = Column(Integer, ForeignKey("cows.id"), nullable=False)
    name = Column(String, nullable=False)
    blob_route = Column(String, nullable=False)
    upload_date = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    cleaning_state = Column(String, nullable=False)

    # Relationships
    uploader = relationship("UserModel", back_populates="datasets")
    cow = relationship("CowModel", back_populates="datasets")
    predictions = relationship("PredictionModel", back_populates="dataset", cascade="all, delete-orphan")


class ModelModel(Base):
    """SQLAlchemy ORM model for ML models."""

    __tablename__ = "models"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    blob_route = Column(String, nullable=False)
    model_metadata = Column(JSON, nullable=True)

    # Relationships
    uploader = relationship("UserModel", back_populates="models")
    predictions = relationship("PredictionModel", back_populates="model", cascade="all, delete-orphan")


class PredictionModel(Base):
    """SQLAlchemy ORM model for predictions."""

    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cow_id = Column(Integer, ForeignKey("cows.id"), nullable=False)
    model_id = Column(Integer, ForeignKey("models.id"), nullable=False)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    date = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    result = Column(JSON, nullable=False)
    state = Column(String, nullable=False)

    # Relationships
    user = relationship("UserModel", back_populates="predictions")
    cow = relationship("CowModel", back_populates="predictions")
    model = relationship("ModelModel", back_populates="predictions")
    dataset = relationship("DatasetModel", back_populates="predictions")
