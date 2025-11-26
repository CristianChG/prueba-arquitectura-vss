"""Application factory with dependency injection."""
import sys
import os

# Add src to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Infrastructure
from infrastructure.database import db_config
from infrastructure.adapters import (
    AuthRepositoryAdapter,
    UserRepositoryAdapter,
    CowRepositoryAdapter,
    DatasetRepositoryAdapter,
    GlobalHatoRepositoryAdapter
)

# Domain Use Cases
from domain.usecases import (
    LoginUser,
    RegisterUser,
    LogoutUser,
    GetCurrentUser,
    RefreshTokenUseCase,
    UploadDataset,
    GetAllUsers,
    UpdateUserRole,
    CreateGlobalHato,
    GetAllGlobalHatos,
    DeleteGlobalHato,
    GetCorralesBySnapshot,
    GetCowsByGroup,
    GetAllCowsBySnapshot
)

# Presentation
from presentation.controllers import AuthController, CowController, DatasetController, UserController, GlobalHatoController
from presentation.routes import create_auth_routes, create_cow_routes, create_dataset_routes, create_user_routes, create_global_hato_routes
from presentation.middleware import register_error_handlers

# Utils
from utils.constants import app_config


def create_app() -> Flask:
    """
    Application factory following the Factory pattern.
    Creates and configures the Flask application with dependency injection.
    """
    load_dotenv()

    app = Flask(__name__)

    # Configure Flask
    app.config['SECRET_KEY'] = app_config.SECRET_KEY
    app.config['MAX_CONTENT_LENGTH'] = app_config.MAX_CONTENT_LENGTH

    # Configure CORS with support for preflight requests
    CORS(
        app,
        origins=app_config.CORS_ORIGINS,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        supports_credentials=True
    )

    # Initialize database
    db_config.create_all_tables()

    # Dependency Injection: Create repository instances
    auth_repository = AuthRepositoryAdapter()
    user_repository = UserRepositoryAdapter()
    cow_repository = CowRepositoryAdapter()
    dataset_repository = DatasetRepositoryAdapter()
    global_hato_repository = GlobalHatoRepositoryAdapter()

    # Dependency Injection: Create use case instances
    login_user = LoginUser(auth_repository)
    register_user = RegisterUser(auth_repository)
    logout_user = LogoutUser(auth_repository)
    get_current_user = GetCurrentUser(auth_repository)
    refresh_token_usecase = RefreshTokenUseCase(auth_repository)
    upload_dataset = UploadDataset(dataset_repository)
    get_all_users = GetAllUsers(user_repository)
    update_user_role = UpdateUserRole(user_repository)
    create_global_hato = CreateGlobalHato(global_hato_repository)
    get_all_global_hatos = GetAllGlobalHatos(global_hato_repository)
    delete_global_hato = DeleteGlobalHato(global_hato_repository)
    get_corrales_by_snapshot = GetCorralesBySnapshot(global_hato_repository)
    get_cows_by_group = GetCowsByGroup(global_hato_repository)
    get_all_cows_by_snapshot = GetAllCowsBySnapshot(global_hato_repository)

    # Dependency Injection: Create controller instances
    auth_controller = AuthController(
        login_user=login_user,
        register_user=register_user,
        logout_user=logout_user,
        get_current_user=get_current_user,
        refresh_token_usecase=refresh_token_usecase
    )
    cow_controller = CowController(cow_repository=cow_repository)
    dataset_controller = DatasetController(
        dataset_repository=dataset_repository,
        upload_dataset=upload_dataset
    )
    user_controller = UserController(
        get_all_users=get_all_users,
        update_user_role=update_user_role
    )
    global_hato_controller = GlobalHatoController(
        create_global_hato=create_global_hato,
        get_all_global_hatos=get_all_global_hatos,
        delete_global_hato=delete_global_hato,
        get_corrales_by_snapshot=get_corrales_by_snapshot,
        get_cows_by_group=get_cows_by_group,
        get_all_cows_by_snapshot=get_all_cows_by_snapshot
    )

    # Register blueprints with injected controllers
    app.register_blueprint(create_auth_routes(auth_controller))
    app.register_blueprint(create_cow_routes(cow_controller))
    app.register_blueprint(create_dataset_routes(dataset_controller))
    app.register_blueprint(create_user_routes(user_controller))
    app.register_blueprint(create_global_hato_routes(global_hato_controller))

    # Register error handlers
    register_error_handlers(app)

    # Health check endpoints
    @app.route('/api/ping')
    def ping():
        return {"ok": True, "message": "pong"}, 200

    @app.route('/api/health')
    def health():
        return {
            "status": "healthy",
            "database": "connected",
            "version": "1.0.0"
        }, 200

    return app
