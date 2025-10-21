from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Model:
    id: str
    name: str
    version: str
    model_type: str
    accuracy: Optional[float]
    dataset_id: str
    trained_by: str
    status: str
    created_at: datetime
    trained_at: Optional[datetime] = None
    model_path: Optional[str] = None
    parameters: Optional[dict] = None
