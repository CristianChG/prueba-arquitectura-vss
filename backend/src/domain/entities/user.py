from dataclasses import dataclass
from datetime import datetime
from enum import Enum


class Role(str, Enum):
    ADMIN = "admin"
    USER = "user"
    RESEARCHER = "researcher"


@dataclass
class User:
    id: str
    email: str
    name: str
    role: Role
    created_at: datetime
    updated_at: datetime
