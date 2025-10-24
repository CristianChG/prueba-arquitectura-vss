from flask import jsonify
from werkzeug.exceptions import HTTPException


def register_error_handlers(app):
    """Register global error handlers for the Flask app."""

    @app.errorhandler(400)
    def bad_request(error):
        """Handle 400 Bad Request errors."""
        return jsonify({
            "error": "Bad Request",
            "message": str(error.description) if hasattr(error, 'description') else "Invalid request"
        }), 400

    @app.errorhandler(401)
    def unauthorized(error):
        """Handle 401 Unauthorized errors."""
        return jsonify({
            "error": "Unauthorized",
            "message": "Authentication is required"
        }), 401

    @app.errorhandler(403)
    def forbidden(error):
        """Handle 403 Forbidden errors."""
        return jsonify({
            "error": "Forbidden",
            "message": "You don't have permission to access this resource"
        }), 403

    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 Not Found errors."""
        return jsonify({
            "error": "Not Found",
            "message": "The requested resource was not found"
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        """Handle 405 Method Not Allowed errors."""
        return jsonify({
            "error": "Method Not Allowed",
            "message": "The method is not allowed for this endpoint"
        }), 405

    @app.errorhandler(500)
    def internal_server_error(error):
        """Handle 500 Internal Server Error."""
        return jsonify({
            "error": "Internal Server Error",
            "message": "An unexpected error occurred"
        }), 500

    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        """Handle all other HTTP exceptions."""
        return jsonify({
            "error": error.name,
            "message": error.description
        }), error.code

    @app.errorhandler(Exception)
    def handle_generic_exception(error):
        """Handle all uncaught exceptions."""
        # Log the error here (use proper logging in production)
        print(f"Unhandled exception: {str(error)}")

        return jsonify({
            "error": "Internal Server Error",
            "message": "An unexpected error occurred"
        }), 500
