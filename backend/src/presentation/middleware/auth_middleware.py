from functools import wraps
from flask import request, jsonify
import jwt
import os


# Get JWT secret key - fail fast if not set
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    raise ValueError(
        "JWT_SECRET_KEY environment variable is required!\n"
        "Please set it in your .env file."
    )


def auth_required(f):
    """Authentication middleware decorator."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None

        # Get token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({"error": "Invalid authorization header format"}), 401

        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401

        try:
            # Verify token
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])

            # Add user_id to request context
            request.user_id = payload.get("sub")

            if not request.user_id:
                return jsonify({"error": "Invalid token payload"}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        except Exception as e:
            return jsonify({"error": "Authentication failed"}), 401

        return f(*args, **kwargs)

    return decorated_function


def role_required(*allowed_roles):
    """Role-based authorization middleware decorator."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # First check authentication
            if not hasattr(request, 'user_id'):
                return jsonify({"error": "Authentication required"}), 401

            # Get user role from token or database
            # For now, we'll add role to JWT payload
            token = request.headers.get('Authorization', '').split(" ")[1]

            try:
                payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
                user_role = payload.get("role")

                if user_role not in allowed_roles:
                    return jsonify({"error": "Insufficient permissions"}), 403

            except Exception:
                return jsonify({"error": "Authorization failed"}), 403

            return f(*args, **kwargs)

        return decorated_function
    return decorator


# Convenience decorators
def require_auth(f):
    """Decorator that requires authentication."""
    return auth_required(f)


def require_admin(f):
    """Decorator that requires admin role."""
    from utils.constants.roles import ROLE_ADMIN
    return role_required(ROLE_ADMIN)(f)
