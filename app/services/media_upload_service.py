import logging
from app.config.config import Config
from app.utils.cloudinary_helper import upload_image, delete_image
from app.utils.exceptions import (
    MissingFileError,
    InvalidFolderError,
    InvalidExtensionError,
    FileSizeExceededError,
    CloudinaryUploadError
)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def upload_to_folder(file, folder_name: str) -> dict:
    """
    Validates the uploaded file and destination folder, then uploads the file to Cloudinary.
    
    Args:
        file: The file object from Flask's request.files (typically a Werkzeug FileStorage object).
        folder_name: The destination folder whitelisted in Config.
        
    Returns:
        dict: A dictionary containing 'url' and 'public_id' of the uploaded asset.
        
    Raises:
        MissingFileError: If the file is not provided or empty.
        InvalidFolderError: If the folder name is not in the whitelist.
        InvalidExtensionError: If the file extension is not allowed.
        FileSizeExceededError: If the file size exceeds the maximum limit (5MB).
        CloudinaryUploadError: If the upload operation to Cloudinary fails.
    """
    # 1. Validate file existence
    if file is None or not getattr(file, "filename", ""):
        logger.error("Upload attempt failed: File object is missing or has an empty filename.")
        raise MissingFileError()
        
    filename = file.filename
    logger.info(f"Received upload request for file '{filename}' into folder '{folder_name}'.")

    # 2. Validate folder name against whitelist
    if folder_name not in Config.VALID_FOLDERS:
        logger.error(f"Upload attempt failed: Folder '{folder_name}' is not in the whitelist.")
        raise InvalidFolderError(folder_name, Config.VALID_FOLDERS)

    # 3. Validate file extension
    if "." not in filename:
        logger.error(f"Upload attempt failed: Filename '{filename}' does not contain an extension.")
        raise InvalidExtensionError("", Config.ALLOWED_FORMATS)
        
    ext = filename.rsplit(".", 1)[1].lower()
    if ext not in Config.ALLOWED_FORMATS:
        logger.error(f"Upload attempt failed: Extension '{ext}' is not supported.")
        raise InvalidExtensionError(ext, Config.ALLOWED_FORMATS)

    # 4. Validate file size
    try:
        # Seek to the end to get length, then seek back to start
        file.seek(0, 2)
        size_bytes = file.tell()
        file.seek(0)
    except Exception as e:
        logger.error(f"Failed to read file size: {e}")
        raise MissingFileError("Could not read the uploaded file stream.")

    if size_bytes > Config.MAX_FILE_SIZE_BYTES:
        size_mb = size_bytes / (1024 * 1024)
        logger.error(f"Upload attempt failed: File size ({size_mb:.2f} MB) exceeds limit of {Config.MAX_FILE_SIZE_MB} MB.")
        raise FileSizeExceededError(size_mb, Config.MAX_FILE_SIZE_MB)

    # 5. Call Cloudinary Helper to upload the image
    try:
        logger.info(f"File validation succeeded. Uploading '{filename}' to Cloudinary...")
        upload_details = upload_image(file, folder=folder_name)
        logger.info(f"Upload successful. URL: {upload_details['url']}, Public ID: {upload_details['public_id']}")
        return {
            "url": upload_details["url"],
            "public_id": upload_details["public_id"]
        }
    except Exception as e:
        logger.error(f"Cloudinary upload failed: {str(e)}")
        raise CloudinaryUploadError(f"Cloudinary upload service failed: {str(e)}")


def delete_from_cloudinary(public_id: str) -> bool:
    """
    Deletes an asset from Cloudinary by its public ID.
    
    Args:
        public_id: The public ID of the image to delete.
        
    Returns:
        bool: True if deleted successfully, False otherwise.
    """
    if not public_id:
        logger.error("Deletion attempt failed: Public ID is empty.")
        return False
        
    try:
        logger.info(f"Attempting to delete image with public ID '{public_id}'...")
        response = delete_image(public_id)
        result = response.get("result")
        if result == "ok":
            logger.info(f"Successfully deleted image '{public_id}' from Cloudinary.")
            return True
        else:
            logger.warning(f"Delete response for '{public_id}' was not 'ok': {response}")
            return False
    except Exception as e:
        logger.error(f"Failed to delete image '{public_id}': {e}")
        return False
