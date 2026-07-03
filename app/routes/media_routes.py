from functools import wraps
import logging
from flask import Blueprint, request, jsonify
from app.config.config import Config
from app.services.media_upload_service import upload_to_folder
from app.utils.exceptions import MediaUploadError

# Set up logging
logger = logging.getLogger(__name__)

media_bp = Blueprint("media", __name__)

def require_admin(f):
    """
    Decorator to restrict access to admin users.
    Acts as a mock decorator for local development and testing.
    
    Accepts:
      - Header 'Authorization': 'Bearer admin-token-xyz'
      - Header 'X-Admin-Token': 'admin-secret'
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        admin_token = request.headers.get("X-Admin-Token")
        
        is_authorized = False
        
        # Mock token validation logic
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            if token == "admin-token-xyz":
                is_authorized = True
        elif admin_token == "admin-secret":
            is_authorized = True
            
        if not is_authorized:
            logger.warning("Unauthorized access attempt detected.")
            return jsonify({
                "success": False,
                "message": "Unauthorized. Admin privileges required.",
                "errors": ["Missing or invalid admin authentication credentials."]
            }), 401
            
        return f(*args, **kwargs)
    return decorated_function


@media_bp.route("/api/admin/media/upload", methods=["POST"])
@require_admin
def upload_media():
    """
    Admin media upload endpoint.
    Accepts multipart/form-data with fields:
      - file: The file to be uploaded (required)
      - folder: The target folder whitelist path (optional, defaults to 'galxy/general')
      
    Returns:
      JSON: Success or Failure payload.
    """
    # 1. Ensure file is present in multipart request
    if "file" not in request.files:
        logger.error("Upload route called but 'file' parameter was missing.")
        return jsonify({
            "success": False,
            "message": "No file was uploaded or file field is missing.",
            "errors": ["The 'file' parameter must be provided in multipart/form-data."]
        }), 400
        
    file = request.files["file"]
    
    # 2. Get the target folder (default if not specified)
    folder = request.form.get("folder", Config.DEFAULT_FOLDER)
    
    try:
        # 3. Call the media upload service
        result = upload_to_folder(file, folder)
        
        # 4. Return success response
        return jsonify({
            "success": True,
            "data": {
                "url": result["url"],
                "public_id": result["public_id"]
            }
        }), 200
        
    except MediaUploadError as e:
        # Domain exceptions mapped to their specific status codes (e.g. 400, 413, 500)
        logger.warning(f"Business validation error: {e.message}")
        return jsonify({
            "success": False,
            "message": e.message,
            "errors": [e.__class__.__name__]
        }), e.status_code
        
    except Exception as e:
        # Unexpected server errors (500)
        logger.exception("Unexpected server error occurred during upload.")
        return jsonify({
            "success": False,
            "message": "An unexpected server error occurred.",
            "errors": [str(e)]
        }), 500
