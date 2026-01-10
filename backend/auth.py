from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from db import db
import logging, json

auth_bp = Blueprint("auth", __name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def log_request(label, data):
    logger.info("%s payload:\n%s", label, json.dumps(data, indent=2))


# ================= USER SIGNUP =================

@auth_bp.route("/user/signup", methods=["POST"])
def user_signup():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    log_request("USER SIGNUP", data)

    email = data.get("email", "").lower().strip()
    password = data.get("password")
    full_name = data.get("fullName")
    mobile = data.get("mobile")

    if not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    # 🔒 ONE EMAIL = ONE ROLE
    if db.users.find_one({"email": email}) or db.company.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 409

    db.users.insert_one({
        "email": email,
        "password": generate_password_hash(password),
        "fullName": full_name,
        "mobile": mobile,
        "role": "user"
    })

    return jsonify({"message": "User created"}), 201


# ================= USER LOGIN =================

@auth_bp.route("/user/login", methods=["POST"])
def user_login():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    log_request("USER LOGIN", data)

    email = data.get("email", "").lower().strip()
    password = data.get("password")

    user = db.users.find_one({"email": email})

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity={
        "id": str(user["_id"]),
        "role": "user"
    })

    return jsonify({"token": token}), 200


# ================= COMPANY SIGNUP =================

@auth_bp.route("/company/signup", methods=["POST"])
def company_signup():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    log_request("COMPANY SIGNUP", data)

    email = (data.get("email") or data.get("companyEmail") or "").lower().strip()
    password = data.get("password")
    company_name = data.get("companyName")
    contact_person = data.get("contactPerson")
    contact_number = data.get("contactNumber") or data.get("mobile")
    website = data.get("website")

    if not email or not password or not company_name:
        return jsonify({"error": "Missing fields"}), 400

    # 🔒 ONE EMAIL = ONE ROLE
    if db.company.find_one({"email": email}) or db.users.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 409

    db.company.insert_one({
        "email": email,
        "password": generate_password_hash(password),
        "companyName": company_name,
        "contactPerson": contact_person,
        "contactNumber": contact_number,
        "website": website,
        "role": "company"
    })

    return jsonify({"message": "Company created"}), 201


# ================= COMPANY LOGIN =================

@auth_bp.route("/company/login", methods=["POST"])
def company_login():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    log_request("COMPANY LOGIN", data)

    email = data.get("email", "").lower().strip()
    password = data.get("password")

    company = db.company.find_one({"email": email})

    if not company or not check_password_hash(company["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity={
        "id": str(company["_id"]),
        "role": "company"
    })

    return jsonify({"token": token}), 200
