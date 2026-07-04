from functools import wraps
from flask import request, jsonify, g
import jwt
import inspect
from config import Config

def require_admin(f):
    """
    Standalone development-only fallback require_admin decorator.
    Decodes and validates JWT tokens against the local Config.JWT_SECRET.
    This is bypassed when running in production/staging environments.
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
            except Exception:
                pass

        if not token:
            return jsonify({
                "success": False,
                "message": "Authorization token is missing. Please provide a valid Bearer token.",
                "errors": {"authorization": "Bearer token required"}
            }), 401

        try:
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
            user_id = payload.get('sub')
            role = payload.get('role')
            
            if role not in ['admin', 'super_admin']:
                return jsonify({
                    "success": False,
                    "message": "Access denied. Insufficient permissions for this operation.",
                    "errors": {"role": "Admin privileges required"}
                }), 403
                
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
        except jwt.InvalidTokenError:
            return jsonify({
                "success": False,
                "message": "Invalid token signature or format.",
                "errors": {"token": "Invalid token"}
            }), 401

        sig = inspect.signature(f)
        if 'current_user' in sig.parameters:
            kwargs['current_user'] = g.user

        return f(*args, **kwargs)
    return decorated
