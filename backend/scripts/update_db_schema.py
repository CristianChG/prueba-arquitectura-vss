import sys
import os
from sqlalchemy import text

# Add src to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

# Set env var for DB connection
os.environ["DATABASE_URL"] = "postgresql://admin:admin@localhost:5432/vacas"

from infrastructure.database.db_config import db_config

def update_schema():
    print("Updating database schema...")
    session = db_config.get_session()
    try:
        # Check if column exists
        result = session.execute(text(
            "SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='reset_code'"
        ))
        if result.fetchone():
            print("Column reset_code already exists.")
        else:
            print("Adding reset_code column...")
            session.execute(text("ALTER TABLE users ADD COLUMN reset_code VARCHAR"))
            
        result = session.execute(text(
            "SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='reset_code_expires'"
        ))
        if result.fetchone():
            print("Column reset_code_expires already exists.")
        else:
            print("Adding reset_code_expires column...")
            session.execute(text("ALTER TABLE users ADD COLUMN reset_code_expires TIMESTAMP"))
            
        # Check for model_metadata in models table
        result = session.execute(text(
            "SELECT column_name FROM information_schema.columns WHERE table_name='models' AND column_name='model_metadata'"
        ))
        if result.fetchone():
            print("Column model_metadata already exists.")
        else:
            print("Adding model_metadata column...")
            session.execute(text("ALTER TABLE models ADD COLUMN model_metadata JSONB"))
            
        session.commit()
        print("Schema update completed.")
    except Exception as e:
        print(f"Error updating schema: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    update_schema()
