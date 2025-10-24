import uuid
from typing import Optional, List
from domain.entities import Dataset
from domain.repositories import IDatasetRepository
from infrastructure.database import DatasetModel
from infrastructure.database.db_config import db_config


class DatasetRepositoryAdapter(IDatasetRepository):
    """Dataset repository adapter using SQLAlchemy."""

    def __init__(self):
        self.db = db_config

    async def find_by_id(self, dataset_id: str) -> Optional[Dataset]:
        """Find dataset by ID."""
        session = self.db.get_session()
        try:
            dataset_model = session.query(DatasetModel).filter(DatasetModel.id == dataset_id).first()
            return self._model_to_entity(dataset_model) if dataset_model else None
        finally:
            session.close()

    async def find_by_uploader(self, user_id: str) -> List[Dataset]:
        """Find all datasets uploaded by a specific user."""
        session = self.db.get_session()
        try:
            dataset_models = session.query(DatasetModel).filter(DatasetModel.uploaded_by == user_id).all()
            return [self._model_to_entity(model) for model in dataset_models]
        finally:
            session.close()

    async def create(self, dataset: Dataset) -> Dataset:
        """Create a new dataset record."""
        session = self.db.get_session()
        try:
            dataset_model = DatasetModel(
                id=dataset.id or str(uuid.uuid4()),
                name=dataset.name,
                file_path=dataset.file_path,
                file_size=dataset.file_size,
                uploaded_by=dataset.uploaded_by,
                status=dataset.status,
                processed_at=dataset.processed_at,
                meta=dataset.metadata  # Map entity.metadata to model.meta
            )

            session.add(dataset_model)
            session.commit()
            session.refresh(dataset_model)

            return self._model_to_entity(dataset_model)
        finally:
            session.close()

    async def update(self, dataset: Dataset) -> Dataset:
        """Update existing dataset."""
        session = self.db.get_session()
        try:
            dataset_model = session.query(DatasetModel).filter(DatasetModel.id == dataset.id).first()

            if not dataset_model:
                raise ValueError("Dataset not found")

            dataset_model.name = dataset.name
            dataset_model.status = dataset.status
            dataset_model.processed_at = dataset.processed_at
            dataset_model.meta = dataset.metadata  # Map entity.metadata to model.meta

            session.commit()
            session.refresh(dataset_model)

            return self._model_to_entity(dataset_model)
        finally:
            session.close()

    async def delete(self, dataset_id: str) -> None:
        """Delete dataset by ID."""
        session = self.db.get_session()
        try:
            dataset_model = session.query(DatasetModel).filter(DatasetModel.id == dataset_id).first()

            if dataset_model:
                session.delete(dataset_model)
                session.commit()
        finally:
            session.close()

    async def find_all(self) -> List[Dataset]:
        """Get all datasets."""
        session = self.db.get_session()
        try:
            dataset_models = session.query(DatasetModel).all()
            return [self._model_to_entity(model) for model in dataset_models]
        finally:
            session.close()

    async def find_by_status(self, status: str) -> List[Dataset]:
        """Find datasets by processing status."""
        session = self.db.get_session()
        try:
            dataset_models = session.query(DatasetModel).filter(DatasetModel.status == status).all()
            return [self._model_to_entity(model) for model in dataset_models]
        finally:
            session.close()

    def _model_to_entity(self, model: DatasetModel) -> Dataset:
        """Convert ORM model to domain entity."""
        return Dataset(
            id=model.id,
            name=model.name,
            file_path=model.file_path,
            file_size=model.file_size,
            uploaded_by=model.uploaded_by,
            status=model.status,
            created_at=model.created_at,
            processed_at=model.processed_at,
            metadata=model.meta  # Map model.meta to entity.metadata
        )
