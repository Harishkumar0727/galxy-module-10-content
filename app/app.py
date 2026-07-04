import os
import logging
from flask import Flask, jsonify
from pymongo import MongoClient
from app.config.config import Config
from app.routes.media_routes import media_bp
from werkzeug.exceptions import HTTPException

# Configure root logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)


def create_app(config_class=Config) -> Flask:
    """
    Application factory to create and configure the Flask app.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)

    # 1. Initialize MongoDB Atlas client
    # PyMongo client is attached to the app object as app.mongo_client and app.db
    # This allows other modules to reuse the connection.
    if config_class.MONGO_URI:
        try:
            logger.info("Connecting to MongoDB Atlas...")
            app.mongo_client = MongoClient(config_class.MONGO_URI)
            app.db = app.mongo_client[config_class.MONGO_DB_NAME]
            # Trigger a connection test (MongoClient is lazy)
            app.mongo_client.admin.command('ping')
            logger.info(
                f"Successfully connected to MongoDB database '{config_class.MONGO_DB_NAME}'.")
        except Exception as e:
            logger.error(f"MongoDB connection failed: {e}")
            app.mongo_client = None
            app.db = None
    else:
        logger.warning("MONGO_URI not configured. MongoDB connection skipped.")
        app.mongo_client = None
        app.db = None

    # 2. Register request ID generator
    import uuid
    from flask import g, request

    @app.before_request
    def add_request_id():
        g.request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

    # 3. Register Blueprints
    logger.info("Registering media routes blueprint...")
    app.register_blueprint(media_bp)

    # 3. Register global exception handlers
    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        """
        Global handler for built-in HTTPExceptions.
        Specifically handles Werkzeug 413 payload too large.
        """
        # Catch Flask's request payload limit (MAX_CONTENT_LENGTH)
        if e.code == 413:
            logger.warning(
                "Request payload exceeded MAX_CONTENT_LENGTH limit.")
            return jsonify({
                "success": False,
                "message": f"File size exceeds the maximum limit of {config_class.MAX_FILE_SIZE_MB} MB.",
                "errors": ["RequestEntityTooLarge"]
            }), 413

        logger.warning(f"HTTPException {e.code}: {e.description}")
        return jsonify({
            "success": False,
            "message": e.description,
            "errors": [e.name]
        }), e.code

    @app.errorhandler(Exception)
    def handle_unexpected_exception(e):
        """
        Catch-all handler for unhandled exceptions.
        """
        logger.exception("An unhandled exception occurred.")
        return jsonify({
            "success": False,
            "message": "An unexpected server error occurred.",
            "errors": [str(e)]
        }), 500

    logger.info("Flask application configured successfully.")
    return app


if __name__ == "__main__":
    app = create_app()
    # Read port from environment if available
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
