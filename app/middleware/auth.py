from functools import wraps
import logging
from flask import request, jsonify, current_app
import jwt

logger = logging.getLogger(__name__)

# Try to import the official require_admin from Module 1 (Auth) if available in production.
try:
    from auth.middleware import require_admin
except ImportError:
    try:
        from auth import require_admin
    except ImportError:
        # Fallback to local secure JWT verification (no hardcoded bypass credentials)
        def require_admin(f):
            """
            Decorator to restrict access to admin users.
            Integrates JWT authentication checking for admin role or is_admin claim.
            """
            @wraps(f)
            def decorated_function(*args, **kwargs):
                auth_header = request.headers.get("Authorization")
                
                if not auth_header or not auth_header.startswith("Bearer "):
                    logger.warning("Missing or malformed Authorization header.")
                    return jsonify({
                        "success": False,
                        "message": "Unauthorized. Bearer token required in Authorization header.",
                        "errors": ["Missing Authorization header."]
                    }), 401
                    
                token = auth_header.split(" ")[1]
                
                try:
                    # Validate JWT using the Flask application's configured SECRET_KEY
                    payload = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
                except jwt.ExpiredSignatureError:
                    logger.warning("JWT validation failed: Token has expired.")
                    return jsonify({
                        "success": False,
                        "message": "Unauthorized. Token has expired.",
                        "errors": ["ExpiredSignatureError"]
                    }), 401
                except jwt.InvalidTokenError as e:
                    logger.warning(f"JWT validation failed: Invalid token. Error: {e}")
                    return jsonify({
                        "success": False,
                        "message": "Unauthorized. Invalid token.",
                        "errors": [str(e)]
                    }), 401
                except Exception as e:
                    logger.warning(f"JWT validation failed: {e}")
                    return jsonify({
                        "success": False,
                        "message": "Unauthorized. Authentication failed.",
                        "errors": [str(e)]
                    }), 401
                    
                # Authenticated successfully, now verify admin role
                role = payload.get("role") or payload.get("user", {}).get("role")
                is_admin = payload.get("is_admin") or payload.get("user", {}).get("is_admin")
                
                if role == "admin" or is_admin is True:
                    return f(*args, **kwargs)
                    
                logger.warning(f"Access forbidden: User does not have admin privileges. Payload: {payload}")
                return jsonify({
                    "success": False,
                    "message": "Forbidden. Admin privileges required.",
                    "errors": ["AccessDenied"]
                }), 403
            return decorated_function
