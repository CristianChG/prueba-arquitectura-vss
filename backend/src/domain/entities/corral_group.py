"""Corral Group entity."""
from dataclasses import dataclass


@dataclass
class CorralGroup:
    """Entity representing aggregated data for a group of animals (corral)."""
    nombre_grupo: str
    total_animales: int
    produccion_promedio: float  # Average of produccion_leche_ayer
    produccion_total: float     # Sum of produccion_leche_ayer
    produccion_promedio_7dias: float  # Average of produccion_media_7dias
