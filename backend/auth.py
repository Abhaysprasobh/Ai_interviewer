from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from db import db
import logging

auth_bp = Blueprint("auth", __name__)

logger = logging.getLogger(__name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json

    email = data.get("email")
    password = data.get("password")
    full_name = data.get("fullName")
    mobile = data.get("mobile")

    if not email or not password:
        logger.warning(f"Signup attempt with missing fields")
        return jsonify({"error": "Missing fields"}), 400

    existing = db.users.find_one({"email": email})
    if existing:
        print(f"Signup attempt with existing email: {email}")
        return jsonify({"error": "User already exists"}), 409

    db.users.insert_one({
        "email": email,
        "password": generate_password_hash(password),
        "fullName": full_name,
        "mobile": mobile,
        "role": "user"
    })

    print(f"User created successfully: {email}")
    return jsonify({"message": "User created successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = db.users.find_one({"email": email})

    if not user or not check_password_hash(user["password"], password):
        logger.warning(f"Failed login attempt for email: {email}")
        return jsonify({"error": "Invalid credentials"}), 401

    print(f"User logged in successfully: {email}")
    token = create_access_token(identity={
        "id": str(user["_id"]),
        "role": user["role"]
    })

    return jsonify({"token": token})

@auth_bp.route("/companySignup", methods=["POST"])
def signup():
    data = request.json

    email = data.get("email")
    password = data.get("password")
    full_name = data.get("fullName")
    mobile = data.get("mobile")

    if not email or not password:
        logger.warning(f"Signup attempt with missing fields")
        return jsonify({"error": "Missing fields"}), 400

    existing = db.users.find_one({"email": email})
    if existing:
        print(f"Signup attempt with existing email: {email}")
        return jsonify({"error": "User already exists"}), 409

    db.users.insert_one({
        "email": email,
        "password": generate_password_hash(password),
        "fullName": full_name,
        "mobile": mobile,
        "role": "user"
    })

    print(f"User created successfully: {email}")
    return jsonify({"message": "User created successfully"}), 201


@auth_bp.route("/companyLogin", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = db.users.find_one({"email": email})

    if not user or not check_password_hash(user["password"], password):
        logger.warning(f"Failed login attempt for email: {email}")
        return jsonify({"error": "Invalid credentials"}), 401

    print(f"User logged in successfully: {email}")
    token = create_access_token(identity={
        "id": str(user["_id"]),
        "role": user["role"]
    })

    return jsonify({"token": token})
