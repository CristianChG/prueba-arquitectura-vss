"""Global Hato repository adapter using SQLAlchemy."""
from typing import Optional, List, Dict, Any
from domain.entities import GlobalHato, Cow
from domain.repositories import IGlobalHatoRepository
from infrastructure.database import GlobalHatoModel, CowModel
from infrastructure.database.db_config import db_config


class GlobalHatoRepositoryAdapter(IGlobalHatoRepository):
    """Global Hato repository adapter using SQLAlchemy."""

    def __init__(self):
        self.db = db_config

    async def create_global_hato(
        self,
        global_hato: GlobalHato,
        cows: List[Cow]
    ) -> GlobalHato:
        """Create a new Global Hato snapshot with associated cows."""
        session = self.db.get_session()
        try:
            # Create Global Hato model
            global_hato_model = GlobalHatoModel(
                user_id=global_hato.user_id,
                nombre=global_hato.nombre,
                fecha_snapshot=global_hato.fecha_snapshot,
                total_animales=global_hato.total_animales,
                grupos_detectados=global_hato.grupos_detectados,
                created_at=global_hato.created_at
            )

            session.add(global_hato_model)
            session.flush()  # Get global_hato ID before creating cows

            # Create cow models
            cow_models = [
                CowModel(
                    global_hato_id=global_hato_model.id,
                    numero_animal=cow.numero_animal,
                    nombre_grupo=cow.nombre_grupo,
                    produccion_leche_ayer=cow.produccion_leche_ayer,
                    produccion_media_7dias=cow.produccion_media_7dias,
                    estado_reproduccion=cow.estado_reproduccion,
                    dias_ordeno=cow.dias_ordeno
                )
                for cow in cows
            ]

            session.add_all(cow_models)
            session.commit()
            session.refresh(global_hato_model)

            return self._model_to_entity(global_hato_model)
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

    async def find_all_by_user(
        self,
        user_id: int,
        page: int = 1,
        limit: int = 10,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get all Global Hato snapshots for a user with pagination and sorting."""
        session = self.db.get_session()
        try:
            query = session.query(GlobalHatoModel).filter(
                GlobalHatoModel.user_id == user_id
            )

            # Apply sorting
            if sort_by and sort_order:
                column_map = {
                    'nombre': GlobalHatoModel.nombre,
                    'fecha_snapshot': GlobalHatoModel.fecha_snapshot,
                    'total_animales': GlobalHatoModel.total_animales,
                    'created_at': GlobalHatoModel.created_at
                }
                if sort_by in column_map:
                    column = column_map[sort_by]
                    if sort_order.lower() == 'desc':
                        query = query.order_by(column.desc())
                    else:
                        query = query.order_by(column.asc())
            else:
                # Default sorting by created_at descending (newest first)
                query = query.order_by(GlobalHatoModel.created_at.desc())

            # Get total count
            total = query.count()

            # Apply pagination
            offset = (page - 1) * limit
            global_hato_models = query.offset(offset).limit(limit).all()

            # Calculate total pages
            pages = (total + limit - 1) // limit if total > 0 else 0

            return {
                'global_hatos': [self._model_to_entity(model) for model in global_hato_models],
                'total': total,
                'page': page,
                'limit': limit,
                'pages': pages
            }
        finally:
            session.close()

    async def find_by_id(self, global_hato_id: int) -> Optional[GlobalHato]:
        """Find Global Hato snapshot by ID."""
        session = self.db.get_session()
        try:
            global_hato_model = session.query(GlobalHatoModel).filter(
                GlobalHatoModel.id == global_hato_id
            ).first()
            return self._model_to_entity(global_hato_model) if global_hato_model else None
        finally:
            session.close()

    async def delete(self, global_hato_id: int, user_id: int) -> None:
        """Delete Global Hato snapshot and all associated cows (with user ownership check)."""
        session = self.db.get_session()
        try:
            global_hato_model = session.query(GlobalHatoModel).filter(
                GlobalHatoModel.id == global_hato_id,
                GlobalHatoModel.user_id == user_id
            ).first()

            if global_hato_model:
                session.delete(global_hato_model)
                session.commit()
        finally:
            session.close()

    def _model_to_entity(self, model: GlobalHatoModel) -> GlobalHato:
        """Convert ORM model to domain entity."""
        return GlobalHato(
            id=model.id,
            user_id=model.user_id,
            nombre=model.nombre,
            fecha_snapshot=model.fecha_snapshot.date() if hasattr(model.fecha_snapshot, 'date') else model.fecha_snapshot,
            total_animales=model.total_animales,
            grupos_detectados=model.grupos_detectados,
            created_at=model.created_at
        )
