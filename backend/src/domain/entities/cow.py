from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Cow:
    id: str
    name: str
    breed: str
    birth_date: datetime
    owner_id: str
    health_status: str
    last_checkup: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
