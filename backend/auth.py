from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from db import db
import logging

auth_bp = Blueprint("auth", __name__)
logger = logging.getLogger(__name__)

# ================= USER ROUTES =================

@auth_bp.route("/signup", methods=["POST"])
def signup():  # <--- Function name is 'signup'
    data = request.json
    email = data.get("email")
    password = data.get("password")
    full_name = data.get("fullName")
    mobile = data.get("mobile")

    if not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    existing = db.users.find_one({"email": email})
    if existing:
        return jsonify({"error": "User already exists"}), 409

    db.users.insert_one({
        "email": email,
        "password": generate_password_hash(password),
        "fullName": full_name,
        "mobile": mobile,
        "role": "user"
    })

    return jsonify({"message": "User created successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():   # <--- Function name is 'login'
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = db.users.find_one({"email": email})

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity={
        "id": str(user["_id"]),
        "role": user["role"]
    })

    return jsonify({"token": token, "role": user["role"]})


# ================= COMPANY ROUTES =================

@auth_bp.route("/companySignup", methods=["POST"])
def company_signup():  # <--- CHANGED FROM 'signup' TO 'company_signup'
    data = request.json
    email = data.get("email")
    password = data.get("password")
    full_name = data.get("fullName")
    mobile = data.get("mobile")

    if not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    existing = db.users.find_one({"email": email})
    if existing:
        return jsonify({"error": "User/Company already exists"}), 409

    db.users.insert_one({
        "email": email,
        "password": generate_password_hash(password),
        "fullName": full_name,
        "mobile": mobile,
        "role": "company" 
    })

    return jsonify({"message": "Company registered successfully"}), 201

@auth_bp.route("/companyLogin", methods=["POST"])
def company_login():  # <--- CHANGED FROM 'login' TO 'company_login'
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = db.users.find_one({"email": email})

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Optional: ensure this is actually a company account
    if user.get("role") != "company":
        return jsonify({"error": "Not a company account"}), 403

    token = create_access_token(identity={
        "id": str(user["_id"]),
        "role": user["role"]
    })

    return jsonify({"token": token, "role": user["role"]})