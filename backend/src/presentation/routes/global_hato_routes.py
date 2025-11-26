"""Global Hato routes."""
from flask import Blueprint
import asyncio
from presentation.middleware.auth_middleware import require_auth


def create_global_hato_routes(global_hato_controller):
    """Create Global Hato routes with dependency injection."""
    global_hato_bp = Blueprint('global_hatos', __name__, url_prefix='/api/global-hatos')

    @global_hato_bp.route('', methods=['GET'])
    @require_auth
    def get_global_hatos():
        """Get all Global Hato snapshots for current user."""
        return asyncio.run(global_hato_controller.get_global_hatos())

    @global_hato_bp.route('', methods=['POST'])
    @require_auth
    def create_global_hato():
        """Create a new Global Hato snapshot with cows."""
        return asyncio.run(global_hato_controller.create_global_hato_endpoint())

    @global_hato_bp.route('/upload-csv', methods=['POST'])
    @require_auth
    def upload_csv():
        """Upload CSV file to create Global Hato snapshot with cows."""
        return asyncio.run(global_hato_controller.upload_csv_endpoint())

    @global_hato_bp.route('/<int:global_hato_id>/download', methods=['GET'])
    @require_auth
    def download_csv(global_hato_id):
        """Download CSV file for Global Hato snapshot."""
        return asyncio.run(global_hato_controller.download_csv_endpoint(global_hato_id))

    @global_hato_bp.route('/<int:global_hato_id>/corrales', methods=['GET'])
    @require_auth
    def get_corrales(global_hato_id):
        """Get corrales (groups) for a Global Hato snapshot."""
        return asyncio.run(global_hato_controller.get_corrales_endpoint(global_hato_id))

    @global_hato_bp.route('/<int:global_hato_id>', methods=['DELETE'])
    @require_auth
    def delete_global_hato(global_hato_id):
        """Delete a Global Hato snapshot and its cows."""
        return asyncio.run(global_hato_controller.delete_global_hato_endpoint(global_hato_id))

    return global_hato_bp
