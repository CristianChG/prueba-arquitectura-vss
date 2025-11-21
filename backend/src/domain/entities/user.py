from dataclasses import dataclass


@dataclass
class User:
    """User domain entity.

    Role values (stored in utils.constants.roles):
    - 1: ADMIN
    - 2: COLAB
    - 3: PENDING_APPROVAL
    """
    id: int
    name: str
    email: str
    password: str
    role: int
