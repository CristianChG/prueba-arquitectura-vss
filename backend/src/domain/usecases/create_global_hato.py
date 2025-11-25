"""Use case for creating a new Global Hato snapshot."""
from typing import List, Dict, Any, Optional
from datetime import date, datetime
from domain.repositories import IGlobalHatoRepository
from domain.entities import GlobalHato, Cow


class CreateGlobalHato:
    """Use case for creating a new Global Hato snapshot with cows."""

    def __init__(self, global_hato_repository: IGlobalHatoRepository):
        self.global_hato_repository = global_hato_repository

    async def execute(
        self,
        user_id: int,
        nombre: str,
        fecha_snapshot: date,
        cows_data: List[Dict[str, Any]],
        blob_route: Optional[str] = None
    ) -> GlobalHato:
        """
        Execute create Global Hato use case.

        Args:
            user_id: ID of the user creating the snapshot
            nombre: Name of the snapshot
            fecha_snapshot: Date of the snapshot
            cows_data: List of cow dictionaries with parsed CSV data
            blob_route: Optional path to uploaded CSV file

        Returns:
            Created GlobalHato entity

        Raises:
            ValueError: If required data is missing or invalid
        """
        # Validate input
        if not nombre:
            raise ValueError("Nombre is required")

        if not fecha_snapshot:
            raise ValueError("Fecha de snapshot is required")

        if not cows_data or len(cows_data) == 0:
            raise ValueError("At least one cow is required")

        # Calculate metrics from cows data
        total_animales = len(cows_data)
        grupos = set(cow.get('nombre_grupo', '') for cow in cows_data if cow.get('nombre_grupo'))
        grupos_detectados = len(grupos)

        # Create Global Hato entity (id will be assigned by DB)
        global_hato = GlobalHato(
            id=0,  # Will be set by database
            user_id=user_id,
            nombre=nombre,
            fecha_snapshot=fecha_snapshot,
            total_animales=total_animales,
            grupos_detectados=grupos_detectados,
            created_at=datetime.now(),
            blob_route=blob_route
        )

        # Create Cow entities
        cows = [
            Cow(
                id=0,  # Will be set by database
                global_hato_id=0,  # Will be set after global_hato creation
                numero_animal=str(cow.get('numero_animal', '')),
                nombre_grupo=str(cow.get('nombre_grupo', '')),
                produccion_leche_ayer=float(cow.get('produccion_leche_ayer', 0)),
                produccion_media_7dias=float(cow.get('produccion_media_7dias', 0)),
                estado_reproduccion=str(cow.get('estado_reproduccion', '')),
                dias_ordeno=int(cow.get('dias_ordeno', 0))
            )
            for cow in cows_data
        ]

        # Save to repository
        return await self.global_hato_repository.create_global_hato(global_hato, cows)
