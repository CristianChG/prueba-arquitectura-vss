from flask import Blueprint
from presentation.controllers import CowController
from presentation.middleware.auth_middleware import auth_required
import asyncio


def create_cow_routes(cow_controller: CowController) -> Blueprint:
    """Create cow routes blueprint with dependency injection."""

    cow_bp = Blueprint('cow', __name__, url_prefix='/api/cows')

    @cow_bp.route('', methods=['GET'])
    @auth_required
    def get_all_cows():
        """Get all cows endpoint (protected)."""
        return asyncio.run(cow_controller.get_all_cows())

    @cow_bp.route('/<cow_id>', methods=['GET'])
    @auth_required
    def get_cow_by_id(cow_id):
        """Get cow by ID endpoint (protected)."""
        return asyncio.run(cow_controller.get_cow_by_id(cow_id))

    @cow_bp.route('/my', methods=['GET'])
    @auth_required
    def get_user_cows():
        """Get current user's cows endpoint (protected)."""
        return asyncio.run(cow_controller.get_user_cows())

    @cow_bp.route('', methods=['POST'])
    @auth_required
    def create_cow():
        """Create cow endpoint (protected)."""
        return asyncio.run(cow_controller.create_cow())

    @cow_bp.route('/<cow_id>', methods=['PUT'])
    @auth_required
    def update_cow(cow_id):
        """Update cow endpoint (protected)."""
        return asyncio.run(cow_controller.update_cow(cow_id))

    @cow_bp.route('/<cow_id>', methods=['DELETE'])
    @auth_required
    def delete_cow(cow_id):
        """Delete cow endpoint (protected)."""
        return asyncio.run(cow_controller.delete_cow(cow_id))

    return cow_bp
