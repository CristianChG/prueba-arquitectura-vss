import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# SQLAlchemy Base for ORM models
Base = declarative_base()


class DatabaseConfig:
    """Database configuration singleton following the Singleton pattern."""

    _instance = None
    _engine = None
    _session_factory = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConfig, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        """Initialize database engine and session factory."""
        database_url = os.getenv("DATABASE_URL")

        # Fail fast if DATABASE_URL is not set
        if not database_url:
            raise ValueError(
                "DATABASE_URL environment variable is required!\n\n"
                "Please set it in your .env file in the root directory.\n"
                "Example: DATABASE_URL=postgresql://admin:admin@db:5432/vacas\n\n"
                "For Docker: Make sure .env file exists in the root directory.\n"
                "For local development: Set DATABASE_URL=postgresql://admin:admin@localhost:5432/vacas"
            )

        self._engine = create_engine(database_url, pool_pre_ping=True, echo=False)
        self._session_factory = sessionmaker(
            autocommit=False, autoflush=False, bind=self._engine
        )

    @property
    def engine(self):
        """Get database engine."""
        return self._engine

    @property
    def session_factory(self):
        """Get session factory."""
        return self._session_factory

    def get_session(self):
        """Get a new database session."""
        return self._session_factory()

    def create_all_tables(self):
        """Create all database tables."""
        Base.metadata.create_all(bind=self._engine)

    def drop_all_tables(self):
        """Drop all database tables (use with caution)."""
        Base.metadata.drop_all(bind=self._engine)


# Singleton instance
db_config = DatabaseConfig()
