"""Global Hato controller with dependency injection."""
from flask import jsonify, request, send_file
from datetime import datetime
from typing import Optional, Any
from domain.usecases import CreateGlobalHato, GetAllGlobalHatos, DeleteGlobalHato
from infrastructure.storage import local_storage_service
from werkzeug.utils import secure_filename
import os
import uuid
import csv
import pandas as pd
from utils.hato_data_cleaner import HatoDataCleaner


class GlobalHatoController:
    """Global Hato controller with dependency injection."""

    def __init__(
        self,
        create_global_hato: CreateGlobalHato,
        get_all_global_hatos: GetAllGlobalHatos,
        delete_global_hato: DeleteGlobalHato,
        get_corrales_by_snapshot: 'GetCorralesBySnapshot',
        get_cows_by_group: 'GetCowsByGroup',
        get_all_cows_by_snapshot: 'GetAllCowsBySnapshot'
    ):
        self.create_global_hato = create_global_hato
        self.get_all_global_hatos = get_all_global_hatos
        self.delete_global_hato = delete_global_hato
        self.get_corrales_by_snapshot = get_corrales_by_snapshot
        self.get_cows_by_group = get_cows_by_group
        self.get_all_cows_by_snapshot = get_all_cows_by_snapshot

    def _serialize_global_hato(self, global_hato):
        """Serialize GlobalHato entity to JSON."""
        return {
            "id": global_hato.id,
            "nombre": global_hato.nombre,
            "fecha_snapshot": global_hato.fecha_snapshot.isoformat(),
            "total_animales": global_hato.total_animales,
            "grupos_detectados": global_hato.grupos_detectados,
            "created_at": global_hato.created_at.isoformat(),
            "blob_route": global_hato.blob_route
        }

    async def get_global_hatos(self):
        """Handle get all Global Hato snapshots request with pagination, sorting, and filters."""
        try:
            user_id = request.user_id

            # Get query parameters
            page = request.args.get('page', 1, type=int)
            limit = request.args.get('limit', 10, type=int)
            sort_by = request.args.get('sort_by', None, type=str)
            sort_order = request.args.get('sort_order', None, type=str)
            search = request.args.get('search', None, type=str)
            fecha_desde = request.args.get('fecha_desde', None, type=str)
            fecha_hasta = request.args.get('fecha_hasta', None, type=str)

            # Execute use case
            result = await self.get_all_global_hatos.execute(
                user_id, page, limit, sort_by, sort_order, search, fecha_desde, fecha_hasta
            )

            # Format response
            return jsonify({
                "global_hatos": [
                    self._serialize_global_hato(global_hato)
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

            return jsonify(self._serialize_global_hato(global_hato)), 201
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

    async def upload_csv_endpoint(self):
        """Handle CSV file upload for Global Hato snapshot."""
        try:
            user_id = request.user_id

            # Validate file presence
            if 'file' not in request.files:
                return jsonify({"error": "No file provided"}), 400

            file = request.files['file']
            if file.filename == '':
                return jsonify({"error": "No file selected"}), 400

            if not file.filename.endswith('.csv'):
                return jsonify({"error": "File must be a CSV"}), 400

            # Get form data
            nombre = request.form.get('nombre')
            fecha_snapshot_str = request.form.get('fecha_snapshot')

            if not nombre:
                return jsonify({"error": "Nombre is required"}), 400

            if not fecha_snapshot_str:
                return jsonify({"error": "Fecha de snapshot is required"}), 400

            # Parse fecha_snapshot
            try:
                fecha_snapshot = datetime.fromisoformat(fecha_snapshot_str).date()
            except (ValueError, TypeError):
                return jsonify({"error": "Invalid fecha_snapshot format"}), 400

            # Save file temporarily
            filename = secure_filename(file.filename)
            temp_path = f"/tmp/{uuid.uuid4()}_{filename}"
            file.save(temp_path)

            try:
                # Parse CSV and validate rows
                valid_cows = []
                invalid_rows = []

                # Parse CSV using pandas and run cleaner pipeline
                try:
                    # Read CSV with pandas (handles BOM automatically)
                    # Use on_bad_lines='skip' or similar if needed, but default is usually fine
                    df = pd.read_csv(temp_path)
                    
                    # Run cleaning pipeline
                    cleaner = HatoDataCleaner(df)
                    cleaned_df = cleaner.run_pipeline()
                    
                    if cleaned_df.empty:
                         os.remove(temp_path)
                         return jsonify({
                             "error": "No valid rows found after cleaning"
                         }), 400

                    # Convert cleaned DataFrame to list of dicts for validation/processing
                    # Map DataFrame columns to application fields
                    for index, row in cleaned_df.iterrows():
                        try:
                            # Helper to safely parse string field
                            def safe_str(value: Any) -> Optional[str]:
                                """Convert to string and return None if empty."""
                                if pd.isna(value) or str(value).strip() == '':
                                    return None
                                return str(value).strip()

                            # Helper to safely parse numeric values (already handled by fillna(0) but good to be safe)
                            def safe_float(value: Any) -> Optional[float]:
                                if pd.isna(value):
                                    return 0.0
                                try:
                                    return float(value)
                                except (ValueError, TypeError):
                                    return 0.0

                            def safe_int(value: Any) -> Optional[int]:
                                if pd.isna(value):
                                    return 0
                                try:
                                    return int(value)
                                except (ValueError, TypeError):
                                    return 0

                            cow_data = {
                                'numero_animal': str(row['Número del animal']).strip(),
                                'nombre_grupo': str(row['Nombre del grupo']).strip(),
                                'produccion_leche_ayer': safe_float(row.get('Producción de leche ayer')),
                                'produccion_media_7dias': safe_float(row.get('Producción media diaria últimos 7 días')),
                                'estado_reproduccion': safe_str(row.get('Estado de la reproducción')),
                                'dias_ordeno': safe_int(row.get('Días en ordeño')),
                                'numero_seleccion': safe_str(row.get('Número(s) de selección de animal')),
                                # Fields for AI Model
                                'numero_lactacion': safe_int(row.get('Nº Lactación')),
                                'numero_inseminaciones': safe_int(row.get('Número de inseminaciones')),
                                'dias_prenada': safe_int(row.get('Días preñada')),
                                'dias_para_parto': safe_int(row.get('Días para el parto')),
                                'produccion_total_lactacion': safe_float(row.get('Producción TOTAL en lactación'))
                            }

                            # Validate required fields
                            if not cow_data['numero_animal']:
                                raise ValueError("Número del animal is required")
                            if not cow_data['nombre_grupo']:
                                raise ValueError("Nombre del grupo is required")

                            valid_cows.append(cow_data)

                        except (ValueError, KeyError) as e:
                            invalid_rows.append({
                                'row': index + 2, # +2 for 1-based index and header
                                'error': str(e),
                                'data': row.to_dict()
                            })

                except Exception as e:
                     # If pandas fails completely (e.g. invalid CSV format)
                     raise ValueError(f"Error processing CSV: {str(e)}")

                # Check if we have at least some valid rows
                if len(valid_cows) == 0:
                    os.remove(temp_path)
                    return jsonify({
                        "error": "No valid rows found in CSV",
                        "invalid_rows": invalid_rows
                    }), 400

                # Upload file to local storage
                blob_route = local_storage_service.upload_file(
                    temp_path,
                    filename,
                    subfolder="global_hatos"
                )

                # Clean up temp file
                os.remove(temp_path)

                # Execute use case with valid rows
                global_hato = await self.create_global_hato.execute(
                    user_id=user_id,
                    nombre=nombre,
                    fecha_snapshot=fecha_snapshot,
                    cows_data=valid_cows,
                    blob_route=blob_route
                )

                # Build response
                response_data = self._serialize_global_hato(global_hato)

                # Add warnings if there were invalid rows
                if invalid_rows:
                    response_data['warnings'] = {
                        'message': f'{len(invalid_rows)} invalid rows were skipped',
                        'invalid_rows': invalid_rows[:10]  # Limit to first 10 for readability
                    }

                return jsonify(response_data), 201

            except Exception as e:
                # Clean up temp file on error
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                raise e

        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            print(f"Error uploading CSV: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({"error": "Internal server error"}), 500

    async def download_csv_endpoint(self, global_hato_id: int):
        """Handle CSV file download for Global Hato snapshot."""
        try:
            user_id = request.user_id

            # Find global hato
            global_hato = await self.get_all_global_hatos.global_hato_repository.find_by_id(global_hato_id)

            if not global_hato:
                return jsonify({"error": "Global Hato not found"}), 404

            # Verify ownership
            if global_hato.user_id != user_id:
                return jsonify({"error": "Unauthorized"}), 403

            # Check if file exists
            if not global_hato.blob_route:
                return jsonify({"error": "No file associated with this Global Hato"}), 404

            # Get file path
            file_path = local_storage_service.download_file(global_hato.blob_route)

            if not file_path:
                return jsonify({"error": "File not found on disk"}), 404

            # Extract filename from blob_route
            filename = os.path.basename(global_hato.blob_route)

            # Send file
            return send_file(
                file_path,
                mimetype='text/csv',
                as_attachment=True,
                download_name=filename
            )

        except Exception as e:
            print(f"Error downloading CSV: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500

    async def get_corrales_endpoint(self, global_hato_id: int):
        """Handle get corrales by snapshot request."""
        try:
            user_id = request.user_id

            # Execute use case
            corrales = await self.get_corrales_by_snapshot.execute(global_hato_id, user_id)

            # Serialize response
            return jsonify([
                {
                    "nombre_grupo": corral.nombre_grupo,
                    "total_animales": corral.total_animales,
                    "produccion_promedio": corral.produccion_promedio,
                    "produccion_total": corral.produccion_total,
                    "produccion_promedio_7dias": corral.produccion_promedio_7dias
                }
                for corral in corrales
            ]), 200
        except Exception as e:
            print(f"Error getting corrales: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500

    async def get_cows_by_group_endpoint(self, global_hato_id: int, nombre_grupo: str):
        """Handle get cows by group request."""
        try:
            user_id = request.user_id

            # Execute use case
            cows = await self.get_cows_by_group.execute(global_hato_id, user_id, nombre_grupo)

            # Serialize response
            return jsonify([
                {
                    "id": cow.id,
                    "numero_animal": cow.numero_animal,
                    "nombre_grupo": cow.nombre_grupo,
                    "produccion_leche_ayer": cow.produccion_leche_ayer,
                    "produccion_media_7dias": cow.produccion_media_7dias,
                    "estado_reproduccion": cow.estado_reproduccion,
                    "dias_ordeno": cow.dias_ordeno,
                    "numero_seleccion": cow.numero_seleccion,
                    "recomendacion": cow.recomendacion
                }
                for cow in cows
            ]), 200
        except Exception as e:
            print(f"Error getting cows by group: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500

    async def get_all_cows_endpoint(self, global_hato_id: int):
        """Handle get all cows for a snapshot request with pagination, sorting, and filters."""
        try:
            user_id = request.user_id

            # Get query parameters
            page = request.args.get('page', 1, type=int)
            limit = request.args.get('limit', 10, type=int)
            sort_by = request.args.get('sort_by', None, type=str)
            sort_order = request.args.get('sort_order', None, type=str)
            search = request.args.get('search', None, type=str)
            nombre_grupo = request.args.get('nombre_grupo', None, type=str)

            # Execute use case
            result = await self.get_all_cows_by_snapshot.execute(
                global_hato_id,
                user_id,
                page,
                limit,
                sort_by,
                sort_order,
                search,
                nombre_grupo
            )

            # Serialize response
            return jsonify({
                "cows": [
                    {
                        "id": cow.id,
                        "numero_animal": cow.numero_animal,
                        "nombre_grupo": cow.nombre_grupo,
                        "produccion_leche_ayer": cow.produccion_leche_ayer,
                        "produccion_media_7dias": cow.produccion_media_7dias,
                        "estado_reproduccion": cow.estado_reproduccion,
                        "dias_ordeno": cow.dias_ordeno,
                        "numero_seleccion": cow.numero_seleccion,
                        "recomendacion": cow.recomendacion
                    }
                    for cow in result['cows']
                ],
                "pagination": {
                    "total": result['total'],
                    "page": result['page'],
                    "limit": result['limit'],
                    "pages": result['pages']
                }
            }), 200
        except Exception as e:
            print(f"Error getting all cows for snapshot: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
