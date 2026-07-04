from functools import wraps
from flask import request, jsonify, g
import jwt
import datetime
import logging
import inspect
from config import Config

logger = logging.getLogger(__name__)

def require_admin(f):
    """
    Decorator to protect routes requiring admin credentials.
    Expects a JWT token in the 'Authorization: Bearer <token>' header.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                parts = auth_header.split(" ")
                if len(parts) == 2 and parts[0].lower() == 'bearer':
                    token = parts[1]
            except Exception as e:
                logger.warning(f"Error parsing Authorization header: {e}")

        if not token:
            return jsonify({
                "success": False,
                "message": "Authorization token is missing. Please provide a valid Bearer token.",
                "errors": {"authorization": "Bearer token required"}
            }), 401

        try:
            # Decode the JWT token using Config.JWT_SECRET
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
            user_id = payload.get('sub')
            role = payload.get('role')
            
            # Enforce admin roles
            if role not in ['admin', 'super_admin']:
                logger.warning(f"User {user_id} with role '{role}' denied admin access.")
                return jsonify({
                    "success": False,
                    "message": "Access denied. Insufficient permissions for this operation.",
                    "errors": {"role": "Admin privileges required"}
                }), 403
                
            # Store user details in Flask's g context
            g.user = {
                'user_id': user_id,
                'role': role
            }
            
        except jwt.ExpiredSignatureError:
            return jsonify({
                "success": False,
                "message": "Token has expired. Please log in again.",
                "errors": {"token": "Expired token"}
            }), 401
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token check: {e}")
            return jsonify({
                "success": False,
                "message": "Invalid token signature or format.",
                "errors": {"token": "Invalid token"}
            }), 401

        # Check if the decorated function accepts 'current_user' as an argument.
        # This keeps the route function signature clean and compatible.
        sig = inspect.signature(f)
        if 'current_user' in sig.parameters:
            kwargs['current_user'] = g.user

        return f(*args, **kwargs)
        
    return decorated

def generate_admin_token(user_id="default_admin", role="admin", expires_in_hours=2):
    """
    Helper function to generate a test token.
    """
    payload = {
        'sub': user_id,
        'role': role,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=expires_in_hours),
        'iat': datetime.datetime.now(datetime.timezone.utc)
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm='HS256')
