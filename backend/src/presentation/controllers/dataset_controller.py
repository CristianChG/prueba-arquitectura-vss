from flask import jsonify, request
from domain.usecases import UploadDataset
from domain.repositories import IDatasetRepository
from domain.entities import Dataset
from infrastructure.storage import s3_storage_service
from datetime import datetime
from werkzeug.utils import secure_filename
import os
import uuid


class DatasetController:
    """Dataset controller with dependency injection."""

    def __init__(
        self,
        dataset_repository: IDatasetRepository,
        upload_dataset: UploadDataset
    ):
        self.dataset_repository = dataset_repository
        self.upload_dataset = upload_dataset

    async def get_all_datasets(self):
        """Get all datasets."""
        try:
            datasets = await self.dataset_repository.find_all()
            return jsonify([self._serialize_dataset(ds) for ds in datasets]), 200
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500

    async def get_dataset_by_id(self, dataset_id: str):
        """Get dataset by ID."""
        try:
            dataset = await self.dataset_repository.find_by_id(dataset_id)
            if not dataset:
                return jsonify({"error": "Dataset not found"}), 404

            return jsonify(self._serialize_dataset(dataset)), 200
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500

    async def upload(self):
        """Upload a new dataset."""
        try:
            user_id = request.user_id

            # Check if file is in request
            if 'file' not in request.files:
                return jsonify({"error": "No file provided"}), 400

            file = request.files['file']
            if file.filename == '':
                return jsonify({"error": "No file selected"}), 400

            # Get optional metadata from form
            name = request.form.get('name', file.filename)

            # Secure filename and save temporarily
            filename = secure_filename(file.filename)
            temp_path = f"/tmp/{uuid.uuid4()}_{filename}"
            file.save(temp_path)

            # Upload to S3
            s3_key = f"datasets/{user_id}/{uuid.uuid4()}_{filename}"
            s3_path = s3_storage_service.upload_file(temp_path, s3_key)

            # Get file size
            file_size = os.path.getsize(temp_path)

            # Clean up temp file
            os.remove(temp_path)

            # Create dataset entity
            dataset = Dataset(
                id=None,
                name=name,
                file_path=s3_path,
                file_size=file_size,
                uploaded_by=user_id,
                status="uploaded",
                created_at=datetime.utcnow()
            )

            # Execute use case
            created_dataset = await self.upload_dataset.execute(dataset)

            return jsonify(self._serialize_dataset(created_dataset)), 201
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": f"Internal server error: {str(e)}"}), 500

    async def get_user_datasets(self):
        """Get datasets uploaded by current user."""
        try:
            user_id = request.user_id
            datasets = await self.dataset_repository.find_by_uploader(user_id)
            return jsonify([self._serialize_dataset(ds) for ds in datasets]), 200
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500

    def _serialize_dataset(self, dataset: Dataset) -> dict:
        """Serialize dataset entity to JSON."""
        return {
            "id": dataset.id,
            "name": dataset.name,
            "filePath": dataset.file_path,
            "fileSize": dataset.file_size,
            "uploadedBy": dataset.uploaded_by,
            "status": dataset.status,
            "createdAt": dataset.created_at.isoformat(),
            "processedAt": dataset.processed_at.isoformat() if dataset.processed_at else None,
            "metadata": dataset.metadata
        }
