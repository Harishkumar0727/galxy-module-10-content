import os
from dotenv import load_dotenv

# Load environment variables from a .env file if it exists
load_dotenv()

class Config:
    """Base configuration settings for the GALXY backend application."""
    
    # General Flask configuration
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "galxy-default-secret-key-change-in-production")
    
    # MongoDB Atlas configuration
    MONGO_URI: str = os.environ.get("MONGO_URI", "")
    MONGO_DB_NAME: str = os.environ.get("MONGO_DB_NAME", "galxy")
    
    # Cloudinary credentials
    CLOUDINARY_CLOUD_NAME: str = os.environ.get("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.environ.get("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.environ.get("CLOUDINARY_API_SECRET", "")
    
    # Media Validation Constants
    DEFAULT_FOLDER: str = "galxy/general"
    
    VALID_FOLDERS: set[str] = {
        "galxy/products",
        "galxy/categories",
        "galxy/site-content",
        "galxy/reviews",
        "galxy/ai-previews",
        "galxy/general"
    }
    
    ALLOWED_FORMATS: set[str] = {"jpg", "jpeg", "png", "webp"}
    
    MAX_FILE_SIZE_MB: int = 5
    MAX_FILE_SIZE_BYTES: int = MAX_FILE_SIZE_MB * 1024 * 1024  # 5 MB
    
    # Flask-specific request limit (allowing a buffer for multipart/form-data headers)
    MAX_CONTENT_LENGTH: int = (MAX_FILE_SIZE_MB + 1) * 1024 * 1024  # 6 MB limit for request payload
