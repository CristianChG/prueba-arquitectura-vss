"""Global Hato domain entity."""
from dataclasses import dataclass
from datetime import datetime, date


@dataclass
class GlobalHato:
    """Global Hato domain entity representing a livestock herd snapshot."""
    id: int
    user_id: int
    nombre: str
    fecha_snapshot: date
    total_animales: int
    grupos_detectados: int
    created_at: datetime
