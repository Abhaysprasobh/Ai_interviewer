from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from db import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    # Handle invalid / missing JSON
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    email = data.get("email")
    password = data.get("password")

    # Handle missing fields
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    # 🔴 CRITICAL FIX: DB availability check
    if db is None:
        return jsonify({"error": "Database not available"}), 500

    try:
        user = db.users.find_one({"email": email})

        if not user:
            # Auto-register user
            db.users.insert_one({
                "email": email,
                "password": generate_password_hash(password)
            })
            user = db.users.find_one({"email": email})

        # Validate password
        if not check_password_hash(user["password"], password):
            return jsonify({"error": "Invalid credentials"}), 401

        token = create_access_token(identity=str(user["_id"]))
        return jsonify({"token": token}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
