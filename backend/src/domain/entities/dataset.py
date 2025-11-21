from dataclasses import dataclass
from datetime import datetime


@dataclass
class Dataset:
    """Dataset domain entity."""
    id: int
    user_id: int
    cow_id: int
    name: str
    blob_route: str
    upload_date: datetime
    cleaning_state: str
