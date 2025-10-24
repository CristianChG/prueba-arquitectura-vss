from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Dataset:
    id: str
    name: str
    file_path: str
    file_size: int
    uploaded_by: str
    status: str
    created_at: datetime
    processed_at: Optional[datetime] = None
    metadata: Optional[dict] = None
