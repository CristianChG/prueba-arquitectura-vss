"""Global Hato repository adapter using SQLAlchemy."""
from typing import Optional, List, Dict, Any
from sqlalchemy import func
from domain.entities import GlobalHato, Cow, CorralGroup
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
                blob_route=global_hato.blob_route,
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
        sort_order: Optional[str] = None,
        search: Optional[str] = None,
        fecha_desde: Optional[str] = None,
        fecha_hasta: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get all Global Hato snapshots for a user with pagination, sorting, and filters."""
        session = self.db.get_session()
        try:
            query = session.query(GlobalHatoModel).filter(
                GlobalHatoModel.user_id == user_id
            )

            # Apply search filter
            if search:
                query = query.filter(
                    GlobalHatoModel.nombre.ilike(f'%{search}%')
                )

            # Apply date filters
            if fecha_desde:
                query = query.filter(GlobalHatoModel.fecha_snapshot >= fecha_desde)
            if fecha_hasta:
                query = query.filter(GlobalHatoModel.fecha_snapshot <= fecha_hasta)

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

    async def get_corrales_by_snapshot(self, global_hato_id: int, user_id: int) -> List[CorralGroup]:
        """Get aggregated corral data for a snapshot with user ownership verification."""
        session = self.db.get_session()
        try:
            # Verify ownership
            global_hato = session.query(GlobalHatoModel).filter(
                GlobalHatoModel.id == global_hato_id,
                GlobalHatoModel.user_id == user_id
            ).first()

            if not global_hato:
                return []

            # Aggregate query
            results = session.query(
                CowModel.nombre_grupo,
                func.count(CowModel.id).label('total_animales'),
                func.avg(CowModel.produccion_leche_ayer).label('produccion_promedio'),
                func.sum(CowModel.produccion_leche_ayer).label('produccion_total'),
                func.avg(CowModel.produccion_media_7dias).label('produccion_promedio_7dias')
            ).filter(
                CowModel.global_hato_id == global_hato_id,
                CowModel.nombre_grupo.isnot(None),
                CowModel.nombre_grupo != ''
            ).group_by(
                CowModel.nombre_grupo
            ).all()

            return [
                CorralGroup(
                    nombre_grupo=row.nombre_grupo,
                    total_animales=row.total_animales,
                    produccion_promedio=round(float(row.produccion_promedio or 0), 2),
                    produccion_total=round(float(row.produccion_total or 0), 2),
                    produccion_promedio_7dias=round(float(row.produccion_promedio_7dias or 0), 2)
                )
                for row in results
            ]
        finally:
            session.close()

    async def get_cows_by_group(self, global_hato_id: int, user_id: int, nombre_grupo: str) -> List[Cow]:
        """Get cows for a specific group in a snapshot with user ownership verification."""
        session = self.db.get_session()
        try:
            # Verify ownership
            global_hato = session.query(GlobalHatoModel).filter(
                GlobalHatoModel.id == global_hato_id,
                GlobalHatoModel.user_id == user_id
            ).first()

            if not global_hato:
                return []

            # Query cows by group
            cow_models = session.query(CowModel).filter(
                CowModel.global_hato_id == global_hato_id,
                CowModel.nombre_grupo == nombre_grupo
            ).all()

            return [
                Cow(
                    id=cow.id,
                    global_hato_id=cow.global_hato_id,
                    numero_animal=cow.numero_animal,
                    nombre_grupo=cow.nombre_grupo,
                    produccion_leche_ayer=cow.produccion_leche_ayer,
                    produccion_media_7dias=cow.produccion_media_7dias,
                    estado_reproduccion=cow.estado_reproduccion,
                    dias_ordeno=cow.dias_ordeno
                )
                for cow in cow_models
            ]
        finally:
            session.close()

    async def get_all_cows_by_snapshot(
        self,
        global_hato_id: int,
        user_id: int,
        page: int = 1,
        limit: int = 10,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = None,
        search: Optional[str] = None,
        nombre_grupo: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get all cows for a snapshot with pagination, sorting, and filtering."""
        session = self.db.get_session()
        try:
            # Verify ownership
            global_hato = session.query(GlobalHatoModel).filter(
                GlobalHatoModel.id == global_hato_id,
                GlobalHatoModel.user_id == user_id
            ).first()

            if not global_hato:
                return {
                    'cows': [],
                    'total': 0,
                    'page': page,
                    'limit': limit,
                    'pages': 0
                }

            # Base query
            query = session.query(CowModel).filter(
                CowModel.global_hato_id == global_hato_id
            )

            # Apply search filter (partial match on multiple columns)
            if search:
                search_pattern = f'%{search}%'
                query = query.filter(
                    (CowModel.numero_animal.ilike(search_pattern)) |
                    (CowModel.nombre_grupo.ilike(search_pattern)) |
                    (CowModel.estado_reproduccion.ilike(search_pattern))
                )

            # Apply group filter (exact match)
            if nombre_grupo:
                query = query.filter(CowModel.nombre_grupo == nombre_grupo)

            # Apply sorting
            if sort_by and sort_order:
                column_map = {
                    'id': CowModel.id,
                    'numero_animal': CowModel.numero_animal,
                    'nombre_grupo': CowModel.nombre_grupo,
                    'produccion_leche_ayer': CowModel.produccion_leche_ayer,
                    'produccion_media_7dias': CowModel.produccion_media_7dias,
                    'estado_reproduccion': CowModel.estado_reproduccion,
                    'dias_ordeno': CowModel.dias_ordeno
                }
                if sort_by in column_map:
                    column = column_map[sort_by]
                    if sort_order.lower() == 'desc':
                        query = query.order_by(column.desc())
                    else:
                        query = query.order_by(column.asc())
            else:
                # Default sorting by id ascending
                query = query.order_by(CowModel.id.asc())

            # Get total count
            total = query.count()

            # Apply pagination
            offset = (page - 1) * limit
            cow_models = query.offset(offset).limit(limit).all()

            # Calculate total pages
            pages = (total + limit - 1) // limit if total > 0 else 0

            # Convert to entities
            cows = [
                Cow(
                    id=cow.id,
                    global_hato_id=cow.global_hato_id,
                    numero_animal=cow.numero_animal,
                    nombre_grupo=cow.nombre_grupo,
                    produccion_leche_ayer=cow.produccion_leche_ayer,
                    produccion_media_7dias=cow.produccion_media_7dias,
                    estado_reproduccion=cow.estado_reproduccion,
                    dias_ordeno=cow.dias_ordeno
                )
                for cow in cow_models
            ]

            return {
                'cows': cows,
                'total': total,
                'page': page,
                'limit': limit,
                'pages': pages
            }
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
            created_at=model.created_at,
            blob_route=model.blob_route
        )
