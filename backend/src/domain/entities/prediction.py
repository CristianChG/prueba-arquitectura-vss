from dataclasses import dataclass
from datetime import datetime
from typing import Dict, Any


@dataclass
class Prediction:
    """Prediction domain entity."""
    id: int
    user_id: int
    cow_id: int
    model_id: int
    dataset_id: int
    date: datetime
    result: Dict[str, Any]
    state: str
