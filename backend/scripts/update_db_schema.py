import sys
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Add backend/src to path
sys.path.append(os.path.join(os.path.dirname(__file__), '../src'))

load_dotenv()

def update_schema():
    # Only load .env if DATABASE_URL is not already set (to avoid overriding docker exec -e)
    # But wait, if container has it set from env_file, it is set.
    # So we should trust the env var if it's there.
    # Let's print it to see what we have.
    database_url = os.getenv("DATABASE_URL")
    print(f"DEBUG: DATABASE_URL is set to: {database_url}")
    
    if not database_url:
        load_dotenv()
        database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("DATABASE_URL not set")
        return

    engine = create_engine(database_url)
    
    with engine.connect() as conn:
        try:
            # Check if column exists
            result = conn.execute(text(
                "SELECT column_name FROM information_schema.columns "
                "WHERE table_name='cows' AND column_name='recomendacion'"
            ))
            
            if result.fetchone():
                print("Column 'recomendacion' already exists in 'cows' table.")
            else:
                print("Adding 'recomendacion' column to 'cows' table...")
                conn.execute(text("ALTER TABLE cows ADD COLUMN recomendacion INTEGER"))
                conn.commit()
                print("Column added successfully.")
                
        except Exception as e:
            print(f"Error updating schema: {e}")

if __name__ == "__main__":
    update_schema()
