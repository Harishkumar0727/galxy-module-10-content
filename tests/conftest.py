import pytest
from app.app import create_app
from app.config.config import Config

class TestConfig(Config):
    TESTING = True
    MONGO_URI = ""  # Skip MongoDB connection to prevent network calls in tests
    CLOUDINARY_CLOUD_NAME = "test_cloud"
    CLOUDINARY_API_KEY = "test_key"
    CLOUDINARY_API_SECRET = "test_secret"

@pytest.fixture
def app():
    app = create_app(TestConfig)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def admin_headers():
    return {
        "Authorization": "Bearer admin-token-xyz"
    }

@pytest.fixture
def admin_secret_headers():
    return {
        "X-Admin-Token": "admin-secret"
    }

@pytest.fixture
def invalid_auth_headers():
    return {
        "Authorization": "Bearer invalid-token"
    }
