"""User routes."""
from flask import Blueprint
import asyncio


def create_user_routes(user_controller):
    """Create user routes with dependency injection."""
    user_bp = Blueprint('users', __name__, url_prefix='/api/users')

    @user_bp.route('', methods=['GET'])
    def get_users():
        """Get all users (Admin only)."""
        return asyncio.run(user_controller.get_users())

    @user_bp.route('/<int:user_id>/role', methods=['PATCH'])
    def update_role(user_id):
        """Update user role (Admin only)."""
        return asyncio.run(user_controller.update_role(user_id))

    return user_bp
