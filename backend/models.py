"""SQLAlchemy models — single `parts` table per architecture."""

from sqlalchemy import func

from database import db


class Part(db.Model):
    __tablename__ = "parts"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    sku = db.Column(db.String(50), nullable=False, unique=True)
    category = db.Column(db.String(50))
    quantity = db.Column(db.Integer, nullable=False, default=0, server_default="0")
    threshold = db.Column(db.Integer, nullable=False, default=5, server_default="5")
    location = db.Column(db.String(100))
    notes = db.Column(db.Text)
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    def to_dict(self):
        fmt = "%Y-%m-%dT%H:%M:%S"
        return {
            "id": self.id,
            "name": self.name,
            "sku": self.sku,
            "category": self.category,
            "quantity": self.quantity,
            "threshold": self.threshold,
            "location": self.location,
            "notes": self.notes,
            "created_at": self.created_at.strftime(fmt) if self.created_at else None,
            "updated_at": self.updated_at.strftime(fmt) if self.updated_at else None,
        }
