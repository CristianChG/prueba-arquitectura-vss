"""Application configuration constants."""
import os


class AppConfig:
    """Application configuration."""

    # Flask
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    TESTING = os.getenv("TESTING", "False").lower() == "true"

    # Flask SECRET_KEY - Used for sessions/cookies (not JWT)
    # Keep default for development convenience
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")

    # Database - NO DEFAULT (handled in db_config.py with fail-fast)
    DATABASE_URL = os.getenv("DATABASE_URL")

    # JWT - NO DEFAULT (security-critical, handled in adapters/middleware)
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM = "HS256"

    # JWT Token Expiration - Reasonable defaults OK
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    # AWS S3
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
    S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "vss-datasets")

    # Celery
    CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")
    CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379/0")

    # CORS
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

    # File Upload
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", str(100 * 1024 * 1024)))  # 100MB default
    ALLOWED_EXTENSIONS = {"csv", "json", "xlsx", "parquet"}


# Export singleton instance
app_config = AppConfig()
