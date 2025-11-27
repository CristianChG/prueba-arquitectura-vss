from dataclasses import dataclass
from typing import Optional


@dataclass
class Cow:
    """Cow domain entity with Global Hato snapshot fields."""
    id: int
    global_hato_id: Optional[int] = None
    numero_animal: Optional[str] = None
    nombre_grupo: Optional[str] = None
    produccion_leche_ayer: Optional[float] = None
    produccion_media_7dias: Optional[float] = None
    estado_reproduccion: Optional[str] = None
    dias_ordeno: Optional[int] = None
    numero_seleccion: Optional[str] = None
