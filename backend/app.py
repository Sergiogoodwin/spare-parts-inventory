"""Flask application entry point — JSON API only, port 5000."""

from flask import Flask
from flask_cors import CORS

from database import init_db
from routes import api_bp


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///parts.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app)
    init_db(app)
    app.register_blueprint(api_bp, url_prefix="/api")

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
