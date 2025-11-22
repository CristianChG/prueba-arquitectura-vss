from flask import jsonify, request
from domain.usecases import GetAllUsers, UpdateUserRole
from presentation.middleware.auth_middleware import require_auth, require_admin


class UserController:
    """User controller with dependency injection."""

    def __init__(
        self,
        get_all_users: GetAllUsers,
        update_user_role: UpdateUserRole
    ):
        self.get_all_users = get_all_users
        self.update_user_role = update_user_role

    @require_auth
    @require_admin
    async def get_users(self):
        """Handle get all users request with pagination, filters, and sorting (Admin only)."""
        try:
            # Get query parameters
            page = request.args.get('page', 1, type=int)
            limit = request.args.get('limit', 10, type=int)
            search = request.args.get('search', None, type=str)
            role = request.args.get('role', None, type=int)
            sort_by = request.args.get('sort_by', None, type=str)
            sort_order = request.args.get('sort_order', None, type=str)

            # Execute use case
            result = await self.get_all_users.execute(page, limit, search, role, sort_by, sort_order)

            # Format response
            return jsonify({
                "users": [
                    {
                        "id": user.id,
                        "name": user.name,
                        "email": user.email,
                        "role": user.role
                    }
                    for user in result['users']
                ],
                "pagination": {
                    "total": result['total'],
                    "page": result['page'],
                    "limit": result['limit'],
                    "pages": result['pages']
                }
            }), 200
        except Exception as e:
            print(f"Error getting users: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500

    @require_auth
    @require_admin
    async def update_role(self, user_id: int):
        """Handle update user role request (Admin only)."""
        try:
            data = request.get_json()
            new_role = data.get("role")

            if new_role is None:
                return jsonify({"error": "Role is required"}), 400

            updated_user = await self.update_user_role.execute(user_id, new_role)

            return jsonify({
                "id": updated_user.id,
                "name": updated_user.name,
                "email": updated_user.email,
                "role": updated_user.role
            }), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            print(f"Error updating user role: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
