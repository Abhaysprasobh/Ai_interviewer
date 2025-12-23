from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from llm import generate_question, evaluate_answer
import uuid

interview_bp = Blueprint("interview", __name__)

@interview_bp.route("/start", methods=["POST"])
@jwt_required()
def start_interview():
    data = request.get_json()

    role = data.get("role")
    difficulty = data.get("difficulty")

    if not role or not difficulty:
        return jsonify({"error": "Missing role or difficulty"}), 400

    if difficulty not in ["easy", "medium", "hard"]:
        return jsonify({"error": "Invalid difficulty"}), 400

    question = generate_question([role, difficulty])

    return jsonify({
        "question": question
    }), 200
