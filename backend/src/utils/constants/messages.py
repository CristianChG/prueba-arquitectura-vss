"""Application messages and error constants."""


class AuthMessages:
    """Authentication-related messages."""
    REQUIRED_FIELDS = "El correo electrónico y la contraseña son requeridos"
    INVALID_EMAIL = "Formato de correo electrónico inválido"
    INVALID_PASSWORD = "La contraseña debe tener 8-128 caracteres con mayúscula, minúscula y número"
    INVALID_NAME = "Formato de nombre inválido"
    INVALID_CREDENTIALS = "Credenciales inválidas"
    INVALID_TOKEN = "Token inválido"
    TOKEN_EXPIRED = "El token ha expirado"
    USER_EXISTS = "Ya existe un usuario con este correo electrónico"
    USER_NOT_FOUND = "Usuario no encontrado"
    UNAUTHORIZED = "Acceso no autorizado"
    LOGOUT_SUCCESS = "Sesión cerrada exitosamente"


class CowMessages:
    """Cow-related messages."""
    COW_NOT_FOUND = "Vaca no encontrada"
    COW_CREATED = "Vaca creada exitosamente"
    COW_UPDATED = "Vaca actualizada exitosamente"
    COW_DELETED = "Vaca eliminada exitosamente"
    INVALID_COW_DATA = "Datos de vaca inválidos"


class DatasetMessages:
    """Dataset-related messages."""
    DATASET_NOT_FOUND = "Dataset no encontrado"
    DATASET_UPLOADED = "Dataset subido exitosamente"
    DATASET_DELETED = "Dataset eliminado exitosamente"
    NO_FILE_PROVIDED = "No se proporcionó ningún archivo"
    INVALID_FILE = "Archivo inválido"
    UPLOAD_FAILED = "Falló la subida del dataset"


class ModelMessages:
    """Model-related messages."""
    MODEL_NOT_FOUND = "Modelo no encontrado"
    MODEL_CREATED = "Modelo creado exitosamente"
    TRAINING_STARTED = "Entrenamiento del modelo iniciado"
    TRAINING_FAILED = "Falló el entrenamiento del modelo"


class GeneralMessages:
    """General application messages."""
    SUCCESS = "Operación completada exitosamente"
    INTERNAL_ERROR = "Error interno del servidor"
    INVALID_REQUEST = "Solicitud inválida"
    NOT_FOUND = "Recurso no encontrado"
    FORBIDDEN = "Acceso prohibido"


# Export constants
MESSAGES = {
    "AUTH": AuthMessages,
    "COW": CowMessages,
    "DATASET": DatasetMessages,
    "MODEL": ModelMessages,
    "GENERAL": GeneralMessages
}
