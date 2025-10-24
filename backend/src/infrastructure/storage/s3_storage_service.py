import os
import boto3
from typing import Optional
from botocore.exceptions import ClientError


class S3StorageService:
    """S3 Storage service following the Singleton pattern."""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(S3StorageService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        """Initialize S3 client."""
        self.bucket_name = os.getenv("S3_BUCKET_NAME", "vss-datasets")
        self.region = os.getenv("AWS_REGION", "us-east-1")

        # Initialize boto3 client
        self.s3_client = boto3.client(
            's3',
            region_name=self.region,
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
        )

    def upload_file(self, file_path: str, object_name: Optional[str] = None) -> str:
        """
        Upload a file to S3 bucket.

        Args:
            file_path: Path to file to upload
            object_name: S3 object name. If not specified, file_path is used

        Returns:
            S3 object URL
        """
        if object_name is None:
            object_name = os.path.basename(file_path)

        try:
            self.s3_client.upload_file(file_path, self.bucket_name, object_name)
            return f"s3://{self.bucket_name}/{object_name}"
        except ClientError as e:
            raise Exception(f"Failed to upload file to S3: {str(e)}")

    def download_file(self, object_name: str, file_path: str) -> None:
        """
        Download a file from S3 bucket.

        Args:
            object_name: S3 object name
            file_path: Path where file will be saved
        """
        try:
            self.s3_client.download_file(self.bucket_name, object_name, file_path)
        except ClientError as e:
            raise Exception(f"Failed to download file from S3: {str(e)}")

    def delete_file(self, object_name: str) -> None:
        """
        Delete a file from S3 bucket.

        Args:
            object_name: S3 object name
        """
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=object_name)
        except ClientError as e:
            raise Exception(f"Failed to delete file from S3: {str(e)}")

    def generate_presigned_url(self, object_name: str, expiration: int = 3600) -> str:
        """
        Generate a presigned URL for S3 object.

        Args:
            object_name: S3 object name
            expiration: Time in seconds for URL to remain valid

        Returns:
            Presigned URL as string
        """
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_name},
                ExpiresIn=expiration
            )
            return url
        except ClientError as e:
            raise Exception(f"Failed to generate presigned URL: {str(e)}")

    def file_exists(self, object_name: str) -> bool:
        """
        Check if a file exists in S3 bucket.

        Args:
            object_name: S3 object name

        Returns:
            True if file exists, False otherwise
        """
        try:
            self.s3_client.head_object(Bucket=self.bucket_name, Key=object_name)
            return True
        except ClientError:
            return False


# Singleton instance
s3_storage_service = S3StorageService()
