from flask import Blueprint
from presentation.controllers import DatasetController
from presentation.middleware.auth_middleware import auth_required
import asyncio


def create_dataset_routes(dataset_controller: DatasetController) -> Blueprint:
    """Create dataset routes blueprint with dependency injection."""

    dataset_bp = Blueprint('dataset', __name__, url_prefix='/api/datasets')

    @dataset_bp.route('', methods=['GET'])
    @auth_required
    def get_all_datasets():
        """Get all datasets endpoint (protected)."""
        return asyncio.run(dataset_controller.get_all_datasets())

    @dataset_bp.route('/<dataset_id>', methods=['GET'])
    @auth_required
    def get_dataset_by_id(dataset_id):
        """Get dataset by ID endpoint (protected)."""
        return asyncio.run(dataset_controller.get_dataset_by_id(dataset_id))

    @dataset_bp.route('/my', methods=['GET'])
    @auth_required
    def get_user_datasets():
        """Get current user's datasets endpoint (protected)."""
        return asyncio.run(dataset_controller.get_user_datasets())

    @dataset_bp.route('/upload', methods=['POST'])
    @auth_required
    def upload_dataset():
        """Upload dataset endpoint (protected)."""
        return asyncio.run(dataset_controller.upload())

    return dataset_bp
