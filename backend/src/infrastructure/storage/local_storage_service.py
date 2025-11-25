"""Local file storage service following Singleton pattern."""
import os
from typing import Optional
from datetime import datetime
from werkzeug.utils import secure_filename
import shutil


class LocalStorageService:
    """Local Storage service following the Singleton pattern."""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LocalStorageService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        """Initialize storage paths."""
        # Base upload directory (will be mounted as volume)
        self.base_path = os.getenv("UPLOAD_BASE_PATH", "/app/uploads")
        self.global_hatos_path = os.path.join(self.base_path, "global_hatos")

        # Create directories if they don't exist
        os.makedirs(self.global_hatos_path, exist_ok=True)

    def upload_file(
        self,
        file_path: str,
        original_filename: str,
        subfolder: str = "global_hatos"
    ) -> str:
        """
        Upload a file to local storage.

        Args:
            file_path: Path to temporary file to upload
            original_filename: Original filename
            subfolder: Subfolder within uploads (default: global_hatos)

        Returns:
            Relative path to stored file (e.g., "/uploads/global_hatos/timestamp_file.csv")
        """
        # Secure filename
        safe_filename = secure_filename(original_filename)

        # Generate timestamp-based filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename_with_timestamp = f"{timestamp}_{safe_filename}"

        # Destination path
        dest_folder = os.path.join(self.base_path, subfolder)
        os.makedirs(dest_folder, exist_ok=True)
        dest_path = os.path.join(dest_folder, filename_with_timestamp)

        # Copy file (shutil.copy2 preserves metadata)
        shutil.copy2(file_path, dest_path)

        # Return relative path for database storage
        return f"/uploads/{subfolder}/{filename_with_timestamp}"

    def download_file(self, blob_route: str) -> Optional[str]:
        """
        Get absolute path to file for download.

        Args:
            blob_route: Relative path from database (e.g., "/uploads/global_hatos/file.csv")

        Returns:
            Absolute path to file if exists, None otherwise
        """
        # Convert relative path to absolute
        # blob_route format: "/uploads/global_hatos/timestamp_file.csv"
        # Need to convert to: "/app/uploads/global_hatos/timestamp_file.csv"

        if not blob_route or not blob_route.startswith("/uploads/"):
            return None

        # Remove leading "/uploads/" and prepend base_path
        relative_part = blob_route.replace("/uploads/", "")
        absolute_path = os.path.join(self.base_path, relative_part)

        if os.path.exists(absolute_path) and os.path.isfile(absolute_path):
            return absolute_path

        return None

    def delete_file(self, blob_route: str) -> bool:
        """
        Delete a file from local storage.

        Args:
            blob_route: Relative path from database

        Returns:
            True if deleted successfully, False otherwise
        """
        absolute_path = self.download_file(blob_route)  # Reuse logic to get path

        if absolute_path and os.path.exists(absolute_path):
            try:
                os.remove(absolute_path)
                return True
            except OSError as e:
                print(f"Error deleting file {absolute_path}: {str(e)}")
                return False

        return False

    def file_exists(self, blob_route: str) -> bool:
        """
        Check if a file exists in local storage.

        Args:
            blob_route: Relative path from database

        Returns:
            True if file exists, False otherwise
        """
        absolute_path = self.download_file(blob_route)
        return absolute_path is not None


# Singleton instance
local_storage_service = LocalStorageService()
