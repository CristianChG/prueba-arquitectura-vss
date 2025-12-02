import sys
import os
import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Set env var for LocalStorageService to avoid /app permission error
os.environ["UPLOAD_BASE_PATH"] = "/tmp/vacas_test_uploads"
os.environ["DATABASE_URL"] = "postgresql://admin:admin@localhost:5432/vacas"

# Add src to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from infrastructure.database.db_config import Base, db_config
from infrastructure.database.models import UserModel
from infrastructure.adapters.auth_repository_adapter import AuthRepositoryAdapter
from infrastructure.adapters.email_service import EmailService
from domain.usecases.password_recovery import RequestPasswordReset, ResetPassword
from utils.constants.roles import ROLE_COLAB

# Mock Email Service to avoid sending real emails
class MockEmailService(EmailService):
    def __init__(self):
        self.sent_emails = []

    def send_reset_code(self, to_email: str, code: str):
        self.sent_emails.append({"to": to_email, "code": code})
        print(f"MOCK EMAIL: Sent code {code} to {to_email}")

async def test_password_recovery_flow():
    print("\n--- Starting Password Recovery Test ---")
    
    # Setup DB (using SQLite in-memory for speed/isolation if possible, or just the dev db?)
    # Since the app uses the configured DB, let's try to use a test DB or just be careful.
    # For this script, let's just use the actual DB but create a unique test user.
    
    auth_repo = AuthRepositoryAdapter()
    email_service = MockEmailService()
    
    request_reset = RequestPasswordReset(auth_repo, email_service)
    reset_password = ResetPassword(auth_repo)
    
    test_email = "test_recovery@example.com"
    test_pass = "OldPassword123"
    new_pass = "NewPassword456"
    
    # 1. Create Test User
    print(f"1. Creating test user: {test_email}")
    session = db_config.get_session()
    try:
        # Cleanup first
        existing = session.query(UserModel).filter(UserModel.email == test_email).first()
        if existing:
            session.delete(existing)
            session.commit()
            
        # Create
        await auth_repo.register(test_email, test_pass, "Test User")
        print("   User created.")
    except Exception as e:
        print(f"   Error creating user: {e}")
        return
    finally:
        session.close()

    # 2. Request Password Reset
    print("2. Requesting password reset...")
    await request_reset(test_email)
    
    if not email_service.sent_emails:
        print("   FAILED: No email sent.")
        return
        
    sent_email = email_service.sent_emails[0]
    code = sent_email["code"]
    print(f"   Success. Code received: {code}")
    
    # 3. Verify Code in DB
    print("3. Verifying code persistence...")
    session = db_config.get_session()
    user = session.query(UserModel).filter(UserModel.email == test_email).first()
    if user.reset_code != code:
        print(f"   FAILED: DB code {user.reset_code} does not match sent code {code}")
        session.close()
        return
    print("   Success. Code matches DB.")
    session.close()
    
    # 4. Reset Password
    print("4. Resetting password...")
    success = await reset_password(test_email, code, new_pass)
    if not success:
        print("   FAILED: Reset password returned False")
        return
    print("   Success. Password reset confirmed.")
    
    # 5. Verify Login with New Password
    print("5. Verifying login with new password...")
    try:
        token = await auth_repo.login(test_email, new_pass)
        print("   Success. Login successful with new password.")
    except Exception as e:
        print(f"   FAILED: Login failed: {e}")
        return

    # 6. Verify Old Password Fails
    print("6. Verifying old password fails...")
    try:
        await auth_repo.login(test_email, test_pass)
        print("   FAILED: Login with old password should have failed.")
    except ValueError:
        print("   Success. Old password rejected.")
        
    # Cleanup
    print("7. Cleaning up...")
    session = db_config.get_session()
    user = session.query(UserModel).filter(UserModel.email == test_email).first()
    if user:
        session.delete(user)
        session.commit()
    session.close()
    
    print("\n--- TEST PASSED SUCCESSFULLY ---")

if __name__ == "__main__":
    asyncio.run(test_password_recovery_flow())
