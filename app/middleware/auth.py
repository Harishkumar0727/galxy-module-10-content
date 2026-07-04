from functools import wraps
import logging
from flask import request, jsonify
import jwt
from app.config.config import Config

logger = logging.getLogger(__name__)

def require_admin(f):
    """
    Decorator to restrict access to admin users.
    Integrates JWT authentication with mock credentials fallback.
    
    Accepts:
      - Header 'Authorization': 'Bearer admin-token-xyz' (mock)
      - Header 'Authorization': 'Bearer <valid-JWT>' (real JWT)
      - Header 'X-Admin-Token': 'admin-secret' (mock)
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        admin_token = request.headers.get("X-Admin-Token")
        
        is_authorized = False
        
        # 1. Validate JWT Token / Bearer Token
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            
            # Check mock token first for testing compatibility
            if token == "admin-token-xyz":
                is_authorized = True
            else:
                try:
                    # Attempt real JWT validation using Config's SECRET_KEY
                    payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
                    
                    # Verify admin role/privilege in JWT payload
                    role = payload.get("role") or payload.get("user", {}).get("role")
                    is_admin = payload.get("is_admin") or payload.get("user", {}).get("is_admin")
                    
                    if role == "admin" or is_admin is True:
                        is_authorized = True
                    else:
                        logger.warning(f"JWT decoded successfully, but user role is not admin: {payload}")
                except jwt.ExpiredSignatureError:
                    logger.warning("JWT validation failed: Token has expired.")
                except jwt.InvalidTokenError as e:
                    logger.warning(f"JWT validation failed: Invalid token. Error: {e}")
                except Exception as e:
                    logger.warning(f"JWT validation failed: {e}")
                    
        # 2. Validate custom X-Admin-Token header
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
