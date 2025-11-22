from .auth_routes import create_auth_routes
from .cow_routes import create_cow_routes
from .dataset_routes import create_dataset_routes
from .user_routes import create_user_routes

__all__ = [
    "create_auth_routes",
    "create_cow_routes",
    "create_dataset_routes",
    "create_user_routes",
]
