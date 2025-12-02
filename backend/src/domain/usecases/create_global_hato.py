"""Use case for creating a new Global Hato snapshot."""
from typing import List, Dict, Any, Optional
from datetime import date, datetime
from domain.repositories import IGlobalHatoRepository
from domain.entities import GlobalHato, Cow
from infrastructure.ml.services import PredictionService


class CreateGlobalHato:
    """Use case for creating a new Global Hato snapshot with cows."""

    def __init__(self, global_hato_repository: IGlobalHatoRepository, prediction_service: PredictionService):
        self.global_hato_repository = global_hato_repository
        self.prediction_service = prediction_service

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
        cows = []
        for cow_data in cows_data:
            # Predict category
            recomendacion = self.prediction_service.predict_cow_category(cow_data)
            
            cows.append(
                Cow(
                    id=0,  # Will be set by database
                    global_hato_id=0,  # Will be set after global_hato creation
                    numero_animal=str(cow_data.get('numero_animal', '')),
                    nombre_grupo=str(cow_data.get('nombre_grupo', '')),
                    produccion_leche_ayer=float(cow_data['produccion_leche_ayer']) if cow_data.get('produccion_leche_ayer') is not None else None,
                    produccion_media_7dias=float(cow_data['produccion_media_7dias']) if cow_data.get('produccion_media_7dias') is not None else None,
                    estado_reproduccion=str(cow_data.get('estado_reproduccion', '')),
                    dias_ordeno=int(cow_data['dias_ordeno']) if cow_data.get('dias_ordeno') is not None else None,
                    numero_seleccion=str(cow_data['numero_seleccion']) if cow_data.get('numero_seleccion') else None,
                    recomendacion=recomendacion
                )
            )

        # Save to repository
        return await self.global_hato_repository.create_global_hato(global_hato, cows)
