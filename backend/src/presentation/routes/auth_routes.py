from flask import Blueprint
from presentation.controllers import AuthController
from presentation.middleware.auth_middleware import auth_required
import asyncio


def create_auth_routes(auth_controller: AuthController) -> Blueprint:
    """Create authentication routes blueprint with dependency injection."""

    auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

    @auth_bp.route('/login', methods=['POST'])
    def login():
        """Login endpoint."""
        return asyncio.run(auth_controller.login())

    @auth_bp.route('/register', methods=['POST'])
    def register():
        """Register endpoint."""
        return asyncio.run(auth_controller.register())

    @auth_bp.route('/logout', methods=['POST'])
    @auth_required
    def logout():
        """Logout endpoint (protected)."""
        return asyncio.run(auth_controller.logout())

    @auth_bp.route('/me', methods=['GET'])
    @auth_required
    def get_me():
        """Get current user endpoint (protected)."""
        return asyncio.run(auth_controller.get_me())

    @auth_bp.route('/refresh', methods=['POST'])
    def refresh():
        """Refresh token endpoint."""
        return asyncio.run(auth_controller.refresh())

    @auth_bp.route('/forgot-password', methods=['POST'])
    def forgot_password():
        """Forgot password endpoint."""
        return asyncio.run(auth_controller.forgot_password())

    @auth_bp.route('/reset-password', methods=['POST'])
    def reset_password():
        """Reset password endpoint."""
        return asyncio.run(auth_controller.reset_password())

    @auth_bp.route('/verify-code', methods=['POST'])
    def verify_code():
        """Verify reset code endpoint."""
        return asyncio.run(auth_controller.verify_code())

    return auth_bp
