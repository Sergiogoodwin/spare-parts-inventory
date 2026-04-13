"""REST API route handlers — base path /api per architecture."""

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError

from database import db
from models import Part

api_bp = Blueprint("api", __name__)

PART_FIELDS = (
    "name",
    "sku",
    "category",
    "quantity",
    "threshold",
    "location",
    "notes",
)


def _json_body():
    if not request.is_json:
        return None
    return request.get_json(silent=True)


@api_bp.route("/parts", methods=["GET"])
def list_parts():
    try:
        parts = Part.query.order_by(Part.id).all()
        return jsonify([p.to_dict() for p in parts]), 200
    except Exception:
        return jsonify({"error": "Failed to retrieve parts"}), 500


@api_bp.route("/parts", methods=["POST"])
def create_part():
    data = _json_body()
    if data is None:
        return jsonify({"error": "Missing required fields"}), 400

    name = data.get("name")
    sku = data.get("sku")
    if name is None or sku is None or str(name).strip() == "" or str(sku).strip() == "":
        return jsonify({"error": "Missing required fields"}), 400

    quantity = data.get("quantity", 0)
    threshold = data.get("threshold", 5)
    if not isinstance(quantity, int) or not isinstance(threshold, int):
        return jsonify({"error": "Missing required fields"}), 400

    part = Part(
        name=str(name).strip(),
        sku=str(sku).strip(),
        category=data.get("category"),
        quantity=quantity,
        threshold=threshold,
        location=data.get("location"),
        notes=data.get("notes"),
    )

    try:
        db.session.add(part)
        db.session.commit()
        return jsonify(part.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "SKU already exists"}), 409
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to create part"}), 500


def _validate_put_payload(data):
    if data is None or not isinstance(data, dict):
        return "Invalid fields"

    unknown = set(data.keys()) - set(PART_FIELDS)
    if unknown:
        return "Invalid fields"

    for key in PART_FIELDS:
        if key not in data:
            return "Invalid fields"

    name, sku = data["name"], data["sku"]
    if not isinstance(name, str) or not isinstance(sku, str):
        return "Invalid fields"
    if name.strip() == "" or sku.strip() == "":
        return "Invalid fields"

    q, t = data["quantity"], data["threshold"]
    if not isinstance(q, int) or not isinstance(t, int):
        return "Invalid fields"

    cat, loc, notes = data["category"], data["location"], data["notes"]
    if cat is not None and not isinstance(cat, str):
        return "Invalid fields"
    if loc is not None and not isinstance(loc, str):
        return "Invalid fields"
    if notes is not None and not isinstance(notes, str):
        return "Invalid fields"

    return None


@api_bp.route("/parts/<int:part_id>", methods=["PUT"])
def update_part(part_id):
    data = _json_body()
    err = _validate_put_payload(data)
    if err:
        return jsonify({"error": err}), 400

    part = Part.query.get(part_id)
    if part is None:
        return jsonify({"error": "Part not found"}), 404

    other = Part.query.filter(Part.sku == data["sku"].strip(), Part.id != part_id).first()
    if other is not None:
        return jsonify({"error": "Invalid fields"}), 400

    part.name = data["name"].strip()
    part.sku = data["sku"].strip()
    part.category = data["category"]
    part.quantity = data["quantity"]
    part.threshold = data["threshold"]
    part.location = data["location"]
    part.notes = data["notes"]

    try:
        db.session.commit()
        return jsonify(part.to_dict()), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Invalid fields"}), 400
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to update part"}), 500


@api_bp.route("/parts/<int:part_id>", methods=["DELETE"])
def delete_part(part_id):
    part = Part.query.get(part_id)
    if part is None:
        return jsonify({"error": "Part not found"}), 404

    try:
        db.session.delete(part)
        db.session.commit()
        return jsonify({"message": "Part deleted"}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to delete part"}), 500
