import uuid
from typing import Optional, List
from domain.entities import Cow
from domain.repositories import ICowRepository
from infrastructure.database import CowModel
from infrastructure.database.db_config import db_config


class CowRepositoryAdapter(ICowRepository):
    """Cow repository adapter using SQLAlchemy."""

    def __init__(self):
        self.db = db_config

    async def find_by_id(self, cow_id: str) -> Optional[Cow]:
        """Find cow by ID."""
        session = self.db.get_session()
        try:
            cow_model = session.query(CowModel).filter(CowModel.id == cow_id).first()
            return self._model_to_entity(cow_model) if cow_model else None
        finally:
            session.close()

    async def find_by_owner(self, owner_id: str) -> List[Cow]:
        """Find all cows owned by a specific user."""
        session = self.db.get_session()
        try:
            cow_models = session.query(CowModel).filter(CowModel.owner_id == owner_id).all()
            return [self._model_to_entity(model) for model in cow_models]
        finally:
            session.close()

    async def create(self, cow: Cow) -> Cow:
        """Create a new cow record."""
        session = self.db.get_session()
        try:
            cow_model = CowModel(
                id=cow.id or str(uuid.uuid4()),
                name=cow.name,
                breed=cow.breed,
                birth_date=cow.birth_date,
                owner_id=cow.owner_id,
                health_status=cow.health_status,
                last_checkup=cow.last_checkup,
                notes=cow.notes
            )

            session.add(cow_model)
            session.commit()
            session.refresh(cow_model)

            return self._model_to_entity(cow_model)
        finally:
            session.close()

    async def update(self, cow: Cow) -> Cow:
        """Update existing cow."""
        session = self.db.get_session()
        try:
            cow_model = session.query(CowModel).filter(CowModel.id == cow.id).first()

            if not cow_model:
                raise ValueError("Cow not found")

            cow_model.name = cow.name
            cow_model.breed = cow.breed
            cow_model.birth_date = cow.birth_date
            cow_model.health_status = cow.health_status
            cow_model.last_checkup = cow.last_checkup
            cow_model.notes = cow.notes

            session.commit()
            session.refresh(cow_model)

            return self._model_to_entity(cow_model)
        finally:
            session.close()

    async def delete(self, cow_id: str) -> None:
        """Delete cow by ID."""
        session = self.db.get_session()
        try:
            cow_model = session.query(CowModel).filter(CowModel.id == cow_id).first()

            if cow_model:
                session.delete(cow_model)
                session.commit()
        finally:
            session.close()

    async def find_all(self) -> List[Cow]:
        """Get all cows."""
        session = self.db.get_session()
        try:
            cow_models = session.query(CowModel).all()
            return [self._model_to_entity(model) for model in cow_models]
        finally:
            session.close()

    async def find_by_health_status(self, status: str) -> List[Cow]:
        """Find cows by health status."""
        session = self.db.get_session()
        try:
            cow_models = session.query(CowModel).filter(CowModel.health_status == status).all()
            return [self._model_to_entity(model) for model in cow_models]
        finally:
            session.close()

    def _model_to_entity(self, model: CowModel) -> Cow:
        """Convert ORM model to domain entity."""
        return Cow(
            id=model.id,
            name=model.name,
            breed=model.breed,
            birth_date=model.birth_date,
            owner_id=model.owner_id,
            health_status=model.health_status,
            last_checkup=model.last_checkup,
            notes=model.notes,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
