from flask import jsonify, request
from domain.repositories import ICowRepository
from domain.entities import Cow
from datetime import datetime


class CowController:
    """Cow controller with dependency injection."""

    def __init__(self, cow_repository: ICowRepository):
        self.cow_repository = cow_repository

    async def get_all_cows(self):
        """Get all cows."""
        try:
            cows = await self.cow_repository.find_all()
            return jsonify([self._serialize_cow(cow) for cow in cows]), 200
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500

    async def get_cow_by_id(self, cow_id: str):
        """Get cow by ID."""
        try:
            cow = await self.cow_repository.find_by_id(cow_id)
            if not cow:
                return jsonify({"error": "Cow not found"}), 404

            return jsonify(self._serialize_cow(cow)), 200
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500

    async def get_user_cows(self):
        """Get cows owned by current user."""
        try:
            user_id = request.user_id
            cows = await self.cow_repository.find_by_owner(user_id)
            return jsonify([self._serialize_cow(cow) for cow in cows]), 200
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500

    async def create_cow(self):
        """Create a new cow."""
        try:
            data = request.get_json()
            user_id = request.user_id

            cow = Cow(
                id=None,
                name=data.get("name"),
                breed=data.get("breed"),
                birth_date=datetime.fromisoformat(data.get("birthDate")),
                owner_id=user_id,
                health_status=data.get("healthStatus", "unknown"),
                last_checkup=datetime.fromisoformat(data.get("lastCheckup")) if data.get("lastCheckup") else None,
                notes=data.get("notes")
            )

            created_cow = await self.cow_repository.create(cow)
            return jsonify(self._serialize_cow(created_cow)), 201
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500

    async def update_cow(self, cow_id: str):
        """Update existing cow."""
        try:
            data = request.get_json()
            user_id = request.user_id

            # Check if cow exists and belongs to user
            existing_cow = await self.cow_repository.find_by_id(cow_id)
            if not existing_cow:
                return jsonify({"error": "Cow not found"}), 404

            if existing_cow.owner_id != user_id:
                return jsonify({"error": "Unauthorized"}), 403

            cow = Cow(
                id=cow_id,
                name=data.get("name", existing_cow.name),
                breed=data.get("breed", existing_cow.breed),
                birth_date=existing_cow.birth_date,
                owner_id=user_id,
                health_status=data.get("healthStatus", existing_cow.health_status),
                last_checkup=datetime.fromisoformat(data.get("lastCheckup")) if data.get("lastCheckup") else existing_cow.last_checkup,
                notes=data.get("notes", existing_cow.notes)
            )

            updated_cow = await self.cow_repository.update(cow)
            return jsonify(self._serialize_cow(updated_cow)), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500

    async def delete_cow(self, cow_id: str):
        """Delete cow."""
        try:
            user_id = request.user_id

            # Check if cow exists and belongs to user
            existing_cow = await self.cow_repository.find_by_id(cow_id)
            if not existing_cow:
                return jsonify({"error": "Cow not found"}), 404

            if existing_cow.owner_id != user_id:
                return jsonify({"error": "Unauthorized"}), 403

            await self.cow_repository.delete(cow_id)
            return jsonify({"message": "Cow deleted successfully"}), 200
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500

    def _serialize_cow(self, cow: Cow) -> dict:
        """Serialize cow entity to JSON."""
        return {
            "id": cow.id,
            "name": cow.name,
            "breed": cow.breed,
            "birthDate": cow.birth_date.isoformat(),
            "ownerId": cow.owner_id,
            "healthStatus": cow.health_status,
            "lastCheckup": cow.last_checkup.isoformat() if cow.last_checkup else None,
            "notes": cow.notes,
            "createdAt": cow.created_at.isoformat() if cow.created_at else None,
            "updatedAt": cow.updated_at.isoformat() if cow.updated_at else None
        }
