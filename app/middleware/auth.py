from functools import wraps
import logging
from flask import request, jsonify

logger = logging.getLogger(__name__)

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
