from flask import Flask, jsonify
import logging
from config import Config
from app.db import Database
from app.routes.site_content_routes import public_bp
from app.routes.admin_site_content_routes import admin_bp

logger = logging.getLogger(__name__)

def create_app():
    """
    Application Factory to bootstrap the Flask application.
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    # Security hygiene check for hardcoded default fallback keys
    if app.config.get('SECRET_KEY') == 'default-flask-secret-key-galxy':
        logger.warning("SECURITY WARNING: Using default hardcoded SECRET_KEY! Please configure SECRET_KEY in environment variables.")
    if app.config.get('JWT_SECRET') == 'super_secret_jwt_key_for_galxy_cms':
        logger.warning("SECURITY WARNING: Using default hardcoded JWT_SECRET! Please configure JWT_SECRET in environment variables.")

    # Initialize MongoDB Collections & Indexes on startup
    try:
        Database.init_db()
    except Exception as e:
        logger.error(f"Could not initialize database on startup: {e}")

    # Register blueprints
    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp)

    # Enable CORS headers
    @app.after_request
    def add_cors_headers(response):
        # NOTE: CORS wildcard '*' is used for local integration and staging. 
        # Tighten to specific frontend origin(s) before production deployment (F4).
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        return response

    # Global Error Handlers for standardized JSON envelopes
    @app.errorhandler(404)
    def page_not_found(e):
        return jsonify({
            "success": False,
            "data": None,
            "message": "The requested resource was not found."
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({
            "success": False,
            "data": None,
            "message": "The HTTP method is not allowed for this endpoint."
        }), 405

    @app.errorhandler(500)
    def internal_server_error(e):
        logger.error(f"Internal server error: {e}")
        return jsonify({
            "success": False,
            "data": None,
            "message": "An internal server error occurred."
        }), 500

    return app
