import cloudinary
import cloudinary.uploader
from app.config.config import Config

# Initialize Cloudinary Configuration
cloudinary.config(
    cloud_name=Config.CLOUDINARY_CLOUD_NAME,
    api_key=Config.CLOUDINARY_API_KEY,
    api_secret=Config.CLOUDINARY_API_SECRET,
    secure=True
)

def upload_image(file_or_url, folder: str, tags: list[str] | None = None) -> dict:
    """
    Uploads a file-like object, file path, or URL to Cloudinary in the specified folder.
    
    Args:
        file_or_url: A file-like object, file path, or remote URL to upload.
        folder: The destination folder in Cloudinary.
        tags: Optional list of tags to associate with the uploaded image.
        
    Returns:
        dict: A dictionary containing:
            - url: The secure URL of the uploaded image.
            - public_id: The unique identifier of the asset.
            - width: Width of the image.
            - height: Height of the image.
            - format: File format (e.g. png, jpg).
            
    Raises:
        Exception: Direct propagation of exceptions raised by the Cloudinary SDK.
    """
    params = {
        "folder": folder,
        "resource_type": "image"
    }
    if tags:
        params["tags"] = tags
        
    response = cloudinary.uploader.upload(file_or_url, **params)
    
    return {
        "url": response.get("secure_url"),
        "public_id": response.get("public_id"),
        "width": response.get("width"),
        "height": response.get("height"),
        "format": response.get("format")
    }


def delete_image(public_id: str) -> dict:
    """
    Deletes an asset from Cloudinary using its public ID.
    
    Args:
        public_id: The public ID of the image to delete.
        
    Returns:
        dict: The result dictionary returned by the Cloudinary API.
        
    Raises:
        Exception: Direct propagation of exceptions raised by the Cloudinary SDK.
    """
    return cloudinary.uploader.destroy(public_id)
