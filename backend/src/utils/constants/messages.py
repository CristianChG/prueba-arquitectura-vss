"""Application messages and error constants."""


class AuthMessages:
    """Authentication-related messages."""
    REQUIRED_FIELDS = "Email and password are required"
    INVALID_EMAIL = "Invalid email format"
    INVALID_PASSWORD = "Password must be 8-128 characters with uppercase, lowercase, and digit"
    INVALID_NAME = "Invalid name format"
    INVALID_CREDENTIALS = "Invalid credentials"
    INVALID_TOKEN = "Invalid token"
    TOKEN_EXPIRED = "Token has expired"
    USER_EXISTS = "User with this email already exists"
    USER_NOT_FOUND = "User not found"
    UNAUTHORIZED = "Unauthorized access"
    LOGOUT_SUCCESS = "Logged out successfully"


class CowMessages:
    """Cow-related messages."""
    COW_NOT_FOUND = "Cow not found"
    COW_CREATED = "Cow created successfully"
    COW_UPDATED = "Cow updated successfully"
    COW_DELETED = "Cow deleted successfully"
    INVALID_COW_DATA = "Invalid cow data provided"


class DatasetMessages:
    """Dataset-related messages."""
    DATASET_NOT_FOUND = "Dataset not found"
    DATASET_UPLOADED = "Dataset uploaded successfully"
    DATASET_DELETED = "Dataset deleted successfully"
    NO_FILE_PROVIDED = "No file provided"
    INVALID_FILE = "Invalid file"
    UPLOAD_FAILED = "Failed to upload dataset"


class ModelMessages:
    """Model-related messages."""
    MODEL_NOT_FOUND = "Model not found"
    MODEL_CREATED = "Model created successfully"
    TRAINING_STARTED = "Model training started"
    TRAINING_FAILED = "Model training failed"


class GeneralMessages:
    """General application messages."""
    SUCCESS = "Operation completed successfully"
    INTERNAL_ERROR = "Internal server error"
    INVALID_REQUEST = "Invalid request"
    NOT_FOUND = "Resource not found"
    FORBIDDEN = "Access forbidden"


# Export constants
MESSAGES = {
    "AUTH": AuthMessages,
    "COW": CowMessages,
    "DATASET": DatasetMessages,
    "MODEL": ModelMessages,
    "GENERAL": GeneralMessages
}
