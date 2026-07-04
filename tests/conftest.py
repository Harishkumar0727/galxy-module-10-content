import pytest
import jwt
import time
from app.app import create_app
from app.config.config import Config

class TestConfig(Config):
    TESTING = True
    MONGO_URI = ""  # Skip MongoDB connection to prevent network calls in tests
    CLOUDINARY_CLOUD_NAME = "test_cloud"
    CLOUDINARY_API_KEY = "test_key"
    CLOUDINARY_API_SECRET = "test_secret"
    SECRET_KEY = "test-secret-key-for-jwt-signing-long-enough-32"

@pytest.fixture
def app():
    app = create_app(TestConfig)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def admin_headers(app):
    """Generate headers with a valid JWT containing the admin role."""
    payload = {
        "role": "admin",
        "exp": int(time.time()) + 3600
    }
    token = jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")
    return {
        "Authorization": f"Bearer {token}"
    }

@pytest.fixture
def admin_secret_headers(app):
    """Generate headers with a valid JWT containing the is_admin claim."""
    payload = {
        "is_admin": True,
        "exp": int(time.time()) + 3600
    }
    token = jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")
    return {
        "Authorization": f"Bearer {token}"
    }

@pytest.fixture
def invalid_auth_headers():
    """Generate headers with a token signed with an invalid secret key."""
    payload = {
        "role": "admin",
        "exp": int(time.time()) + 3600
    }
    # Signed with an invalid key to fail signature verification
    token = jwt.encode(payload, "invalid-secret-key-long-enough-32", algorithm="HS256")
    return {
        "Authorization": f"Bearer {token}"
    }
