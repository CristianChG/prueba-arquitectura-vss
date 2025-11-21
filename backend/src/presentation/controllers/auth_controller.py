from flask import jsonify, request
from domain.usecases import LoginUser, RegisterUser, LogoutUser, GetCurrentUser, RefreshTokenUseCase


class AuthController:
    """Authentication controller with dependency injection."""

    def __init__(
        self,
        login_user: LoginUser,
        register_user: RegisterUser,
        logout_user: LogoutUser,
        get_current_user: GetCurrentUser,
        refresh_token_usecase: RefreshTokenUseCase
    ):
        self.login_user = login_user
        self.register_user = register_user
        self.logout_user = logout_user
        self.get_current_user = get_current_user
        self.refresh_token_usecase = refresh_token_usecase

    async def login(self):
        """Handle login request."""
        try:
            data = request.get_json()
            email = data.get("email")
            password = data.get("password")

            auth_token = await self.login_user.execute(email, password)

            return jsonify({
                "accessToken": auth_token.access_token,
                "refreshToken": auth_token.refresh_token,
                "tokenType": auth_token.token_type
            }), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500

    async def register(self):
        """Handle registration request."""
        try:
            data = request.get_json()
            email = data.get("email")
            password = data.get("password")
            name = data.get("name")

            user = await self.register_user.execute(email, password, name)

            return jsonify({
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role
            }), 201
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500

    async def logout(self):
        """Handle logout request."""
        try:
            # Get user_id from request context (set by auth middleware)
            user_id = request.user_id

            await self.logout_user.execute(user_id)

            return jsonify({"message": "Logged out successfully"}), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500

    async def get_me(self):
        """Handle get current user request."""
        try:
            # Get user_id from request context (set by auth middleware)
            user_id = request.user_id

            user = await self.get_current_user.execute(user_id)

            return jsonify({
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role
            }), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500

    async def refresh(self):
        """Handle refresh token request."""
        try:
            data = request.get_json()
            refresh_token = data.get("refreshToken")

            auth_token = await self.refresh_token_usecase.execute(refresh_token)

            return jsonify({
                "accessToken": auth_token.access_token,
                "refreshToken": auth_token.refresh_token,
                "tokenType": auth_token.token_type
            }), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500
