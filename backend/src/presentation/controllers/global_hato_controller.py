"""Global Hato controller with dependency injection."""
from flask import jsonify, request
from datetime import datetime
from domain.usecases import CreateGlobalHato, GetAllGlobalHatos, DeleteGlobalHato


class GlobalHatoController:
    """Global Hato controller with dependency injection."""

    def __init__(
        self,
        create_global_hato: CreateGlobalHato,
        get_all_global_hatos: GetAllGlobalHatos,
        delete_global_hato: DeleteGlobalHato
    ):
        self.create_global_hato = create_global_hato
        self.get_all_global_hatos = get_all_global_hatos
        self.delete_global_hato = delete_global_hato

    async def get_global_hatos(self):
        """Handle get all Global Hato snapshots request with pagination and sorting."""
        try:
            user_id = request.user_id

            # Get query parameters
            page = request.args.get('page', 1, type=int)
            limit = request.args.get('limit', 10, type=int)
            sort_by = request.args.get('sort_by', None, type=str)
            sort_order = request.args.get('sort_order', None, type=str)

            # Execute use case
            result = await self.get_all_global_hatos.execute(
                user_id, page, limit, sort_by, sort_order
            )

            # Format response
            return jsonify({
                "global_hatos": [
                    {
                        "id": global_hato.id,
                        "nombre": global_hato.nombre,
                        "fecha_snapshot": global_hato.fecha_snapshot.isoformat(),
                        "total_animales": global_hato.total_animales,
                        "grupos_detectados": global_hato.grupos_detectados,
                        "created_at": global_hato.created_at.isoformat()
                    }
                    for global_hato in result['global_hatos']
                ],
                "pagination": {
                    "total": result['total'],
                    "page": result['page'],
                    "limit": result['limit'],
                    "pages": result['pages']
                }
            }), 200
        except Exception as e:
            print(f"Error getting Global Hatos: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500

    async def create_global_hato_endpoint(self):
        """Handle create Global Hato snapshot request with CSV data."""
        try:
            user_id = request.user_id
            data = request.get_json()

            # Validate required fields
            if not data.get("nombre"):
                return jsonify({"error": "Nombre is required"}), 400

            if not data.get("fecha_snapshot"):
                return jsonify({"error": "Fecha de snapshot is required"}), 400

            if not data.get("cows") or not isinstance(data["cows"], list):
                return jsonify({"error": "Cows data is required"}), 400

            # Parse fecha_snapshot
            try:
                fecha_snapshot = datetime.fromisoformat(data["fecha_snapshot"]).date()
            except (ValueError, TypeError):
                return jsonify({"error": "Invalid fecha_snapshot format"}), 400

            # Validate cows data structure
            required_cow_fields = [
                "numero_animal", "nombre_grupo", "produccion_leche_ayer",
                "produccion_media_7dias", "estado_reproduccion", "dias_ordeno"
            ]
            for cow in data["cows"]:
                for field in required_cow_fields:
                    if field not in cow:
                        return jsonify({"error": f"Missing field in cow data: {field}"}), 400

            # Execute use case
            global_hato = await self.create_global_hato.execute(
                user_id=user_id,
                nombre=data["nombre"],
                fecha_snapshot=fecha_snapshot,
                cows_data=data["cows"]
            )

            return jsonify({
                "id": global_hato.id,
                "nombre": global_hato.nombre,
                "fecha_snapshot": global_hato.fecha_snapshot.isoformat(),
                "total_animales": global_hato.total_animales,
                "grupos_detectados": global_hato.grupos_detectados,
                "created_at": global_hato.created_at.isoformat()
            }), 201
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            print(f"Error creating Global Hato: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({"error": "Internal server error"}), 500

    async def delete_global_hato_endpoint(self, global_hato_id: int):
        """Handle delete Global Hato snapshot request."""
        try:
            user_id = request.user_id

            # Execute use case
            await self.delete_global_hato.execute(global_hato_id, user_id)

            return jsonify({"message": "Global Hato deleted successfully"}), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            print(f"Error deleting Global Hato: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
