# Backend Clean Architecture

This backend follows **Clean Architecture** principles, mirroring the frontend structure with clear separation of concerns across layers.

## 📁 Architecture Overview

```
backend/src/
├── domain/              # Business Logic Layer (Framework Independent)
│   ├── entities/        # Business entities/models
│   ├── repositories/    # Repository interfaces (Protocols)
│   ├── usecases/        # Business use cases
│   └── validations/     # Validation strategies
├── infrastructure/      # External Dependencies Layer
│   ├── adapters/        # Repository implementations
│   ├── database/        # Database configuration & ORM models
│   └── storage/         # Storage services (S3)
├── presentation/        # API/Web Layer
│   ├── controllers/     # Request/response handlers
│   ├── middleware/      # Auth, error handling
│   └── routes/          # Flask blueprints
└── utils/               # Shared Utilities
    └── constants/       # Configuration, messages, regex
```

## 🏗️ Design Patterns Implemented

### 1. **Clean Architecture**
- Clear separation between business logic and infrastructure
- Dependency inversion: domain depends on nothing, all layers depend on domain
- Framework-independent business rules

### 2. **Repository Pattern**
- Abstract data access through interfaces ([i_auth_repository.py](src/domain/repositories/i_auth_repository.py))
- Concrete implementations in infrastructure layer ([auth_repository_adapter.py](src/infrastructure/adapters/auth_repository_adapter.py))
- Easy to swap data sources (SQLAlchemy, MongoDB, etc.)

### 3. **Adapter Pattern**
- Repository adapters bridge domain and infrastructure
- Translate between domain entities and ORM models
- Example: `AuthRepositoryAdapter` implements `IAuthRepository`

### 4. **Strategy Pattern**
- Validation strategies ([i_validation_strategy.py](src/domain/validations/i_validation_strategy.py))
- `EmailValidation`, `PasswordValidation`, `NameValidation`
- Easy to add new validation rules

### 5. **Singleton Pattern**
- Database configuration ([db_config.py](src/infrastructure/database/db_config.py#L15-L22))
- S3 storage service ([s3_storage_service.py](src/infrastructure/storage/s3_storage_service.py#L9-L14))
- Single instance for shared resources

### 6. **Dependency Injection**
- Constructor-based DI throughout the application
- Controllers receive use cases as dependencies
- Use cases receive repositories as dependencies
- Configured in [app_factory.py](src/app_factory.py)

### 7. **Factory Pattern**
- Application factory ([app_factory.py](src/app_factory.py))
- Creates and wires all dependencies
- Centralizes application configuration

## 📦 Layer Responsibilities

### Domain Layer (`domain/`)
**Pure business logic - no external dependencies**

- **Entities**: Domain models (User, Cow, Dataset, Model, AuthToken)
- **Repositories**: Interfaces defining data access contracts
- **Use Cases**: Business logic implementation (LoginUser, RegisterUser, etc.)
- **Validations**: Input validation strategies

### Infrastructure Layer (`infrastructure/`)
**External concerns - databases, APIs, storage**

- **Adapters**: Repository implementations using SQLAlchemy
- **Database**: DB configuration (singleton), ORM models
- **Storage**: S3 storage service (singleton)

### Presentation Layer (`presentation/`)
**HTTP/API layer - Flask-specific code**

- **Controllers**: Handle HTTP requests/responses with DI
- **Routes**: Flask blueprints defining endpoints
- **Middleware**: Authentication, error handling

### Utils Layer (`utils/`)
**Shared utilities and constants**

- **Constants**: Messages, configuration, regex patterns

## 🔄 Request Flow

```
HTTP Request
    ↓
Route (Blueprint)                    # presentation/routes/
    ↓
Middleware (Auth)                    # presentation/middleware/
    ↓
Controller (handles request/response) # presentation/controllers/
    ↓
Use Case (business logic + validation) # domain/usecases/
    ↓
Repository Interface (Protocol)      # domain/repositories/
    ↓
Repository Adapter                   # infrastructure/adapters/
    ↓
Database/ORM (SQLAlchemy)           # infrastructure/database/
    ↓
PostgreSQL
```

### Example: User Login Flow

```
POST /api/auth/login
    ↓
auth_routes.login()                 # Route handler
    ↓
auth_middleware (optional)           # JWT verification
    ↓
AuthController.login()              # Extract email/password
    ↓
LoginUser.execute()                 # Validate inputs
    ↓
IAuthRepository.login()             # Interface call
    ↓
AuthRepositoryAdapter.login()       # Implementation
    ↓
UserModel query (SQLAlchemy)        # Database query
    ↓
Password verification (bcrypt)       # Security check
    ↓
JWT token generation                 # Create tokens
    ↓
Return AuthToken                     # Domain entity
    ↓
JSON Response                        # HTTP 200 + tokens
```

## 🔑 Key Features

### Authentication & Authorization
- JWT-based authentication
- Token refresh mechanism
- Role-based access control middleware
- Password hashing with bcrypt

### Database
- SQLAlchemy ORM
- PostgreSQL
- Singleton pattern for DB connection
- Automatic table creation

### File Storage
- S3 integration for dataset uploads
- Presigned URL generation
- Singleton storage service

### Error Handling
- Global error handlers
- Consistent error response format
- Custom exception handling

## 📝 Usage Example

### Adding a New Feature

1. **Create Entity** (`domain/entities/`)
```python
@dataclass
class NewEntity:
    id: str
    name: str
```

2. **Define Repository Interface** (`domain/repositories/`)
```python
class INewRepository(Protocol):
    async def find_by_id(self, id: str) -> Optional[NewEntity]:
        ...
```

3. **Create Use Case** (`domain/usecases/`)
```python
class CreateNew:
    def __init__(self, repository: INewRepository):
        self.repository = repository

    async def execute(self, data) -> NewEntity:
        # Business logic + validation
        return await self.repository.create(data)
```

4. **Implement Repository** (`infrastructure/adapters/`)
```python
class NewRepositoryAdapter(INewRepository):
    # SQLAlchemy implementation
```

5. **Create Controller** (`presentation/controllers/`)
```python
class NewController:
    def __init__(self, create_new: CreateNew):
        self.create_new = create_new
```

6. **Define Routes** (`presentation/routes/`)
```python
def create_new_routes(controller: NewController) -> Blueprint:
    # Flask routes
```

7. **Wire in Factory** (`app_factory.py`)
```python
# Create instances with DI
new_repository = NewRepositoryAdapter()
create_new = CreateNew(new_repository)
new_controller = NewController(create_new)
app.register_blueprint(create_new_routes(new_controller))
```

## 🚀 Getting Started

### Quick Start with Docker (Recommended)

```bash
# 1. Create .env file in root directory (see GETTING_STARTED.md)
# 2. Start all services
docker-compose up --build
```

### Local Development

1. Install dependencies:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Set environment variables in `.env` (root directory):

   ```env
   DATABASE_URL=postgresql://admin:admin@db:5432/vacas
   JWT_SECRET_KEY=your-secret-key-min-32-chars
   CELERY_BROKER_URL=redis://redis:6379/0
   CELERY_RESULT_BACKEND=redis://redis:6379/0
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   S3_BUCKET_NAME=vss-datasets
   ```

3. Run the application:

   ```bash
   python app.py
   # Server runs on http://localhost:5000
   ```

For complete setup instructions, see [GETTING_STARTED.md](../GETTING_STARTED.md)

## 🧪 Testing Strategy

### Unit Tests

Test use cases with mocked repositories:

```python
# tests/domain/usecases/test_login_user.py
def test_login_user_success():
    # Mock repository
    mock_repo = Mock(IAuthRepository)
    mock_repo.login.return_value = AuthToken(...)

    # Test use case
    use_case = LoginUser(mock_repo)
    result = await use_case.execute("test@example.com", "Password123")

    assert result.access_token is not None
```

### Integration Tests

Test repository adapters with test database:

```python
# tests/infrastructure/adapters/test_auth_repository_adapter.py
def test_auth_repository_creates_user():
    repo = AuthRepositoryAdapter()
    user = await repo.register("test@example.com", "Password123", "Test User")

    assert user.email == "test@example.com"
```

### E2E Tests

Test complete request flow:

```python
# tests/e2e/test_auth_endpoints.py
def test_register_endpoint():
    response = client.post('/api/auth/register', json={
        "email": "test@example.com",
        "password": "Password123",
        "name": "Test User"
    })

    assert response.status_code == 201
```

## 📦 Python Package Structure (`__init__.py`)

Each directory in the clean architecture has an `__init__.py` file that serves multiple purposes:

### 1. Package Marker

Marks directories as Python packages, enabling imports:

```python
# backend/src/domain/__init__.py
# Empty file - just marks as package
```

### 2. Clean Import Paths

Simplifies imports by re-exporting classes:

```python
# backend/src/domain/entities/__init__.py
from .user import User, Role
from .auth_token import AuthToken
from .cow import Cow

__all__ = ["User", "Role", "AuthToken", "Cow"]
```

**Benefits:**

```python
# Without __init__.py exports:
from domain.entities.user import User
from domain.entities.auth_token import AuthToken

# With __init__.py exports:
from domain.entities import User, AuthToken  # Much cleaner! ✨
```

### 3. Export Control

The `__all__` list explicitly defines what's exported:

```python
# Only these are publicly available
__all__ = ["User", "AuthToken"]

# Private classes/functions are not exported
_InternalHelper  # Not in __all__, stays internal
```

### 4. Usage in Your Project

All major packages use `__init__.py` for clean imports:

- `domain/entities/__init__.py` → Export all entities
- `domain/repositories/__init__.py` → Export all repository interfaces
- `domain/usecases/__init__.py` → Export all use cases
- `infrastructure/adapters/__init__.py` → Export all adapters
- `presentation/controllers/__init__.py` → Export all controllers

**Example from [app_factory.py](src/app_factory.py):**

```python
# Clean imports thanks to __init__.py files
from domain.entities import User, AuthToken
from domain.repositories import IAuthRepository
from domain.usecases import LoginUser, RegisterUser
from infrastructure.adapters import AuthRepositoryAdapter
from presentation.controllers import AuthController
```

## 📚 Comparison with Frontend

The backend architecture mirrors the frontend TypeScript implementation:

| Frontend (TS) | Backend (Python) |
|--------------|------------------|
| `entities/*.ts` | `entities/*.py` |
| `IAuthRepository` interface | `IAuthRepository` Protocol |
| `AuthRepositoryAdapter` class | `AuthRepositoryAdapter` class |
| `LoginUser` use case | `LoginUser` use case |
| `EmailValidation` strategy | `EmailValidation` strategy |
| `LocalStorageService` singleton | `S3StorageService` singleton |
| `axiosConfig` singleton | `DatabaseConfig` singleton |

## 🔐 Security Best Practices

- JWT tokens with expiration
- Password hashing with bcrypt
- Environment-based configuration
- CORS configuration
- Input validation at use case level
- SQL injection protection via ORM

## 📖 Additional Resources

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Flask Best Practices](https://flask.palletsprojects.com/en/3.0.x/patterns/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/en/20/orm/)
