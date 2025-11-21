from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class Model:
    """Model domain entity."""
    id: int
    user_id: int
    name: str
    description: Optional[str]
    blob_route: str
    metadata: Optional[Dict[str, Any]] = None
