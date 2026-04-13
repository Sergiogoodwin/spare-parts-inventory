"""Database connection and initialization (SQLite + SQLAlchemy)."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def init_db(app):
    """Bind SQLAlchemy to the Flask app and create tables if they do not exist."""
    db.init_app(app)
    with app.app_context():
        import models  # noqa: F401 — register Part model before create_all

        db.create_all()
