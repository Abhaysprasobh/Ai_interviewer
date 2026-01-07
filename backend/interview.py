# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from db import db
# from llm import generate_question, evaluate_answer
# import uuid

# interview_bp = Blueprint("interview", __name__)

# @interview_bp.route("/start", methods=["POST"])
# @jwt_required()
# def start_interview():
#     user_id = get_jwt_identity()
#     skills = request.json.get("skills", [])

#     session_id = str(uuid.uuid4())

#     db.sessions.insert_one({
#         "session_id": session_id,
#         "user_id": user_id,
#         "skills": skills,
#         "questions": []
#     })

#     question = generate_question(skills)

#     return jsonify({
#         "session_id": session_id,
#         "question": question
#     })


# @interview_bp.route("/answer", methods=["POST"])
# @jwt_required()
# def answer_question():
#     data = request.json
#     session_id = data["session_id"]
#     question = data["question"]
#     answer = data["answer"]

#     feedback = evaluate_answer(question, answer)

#     db.sessions.update_one(
#         {"session_id": session_id},
#         {"$push": {
#             "questions": {
#                 "question": question,
#                 "answer": answer,
#                 "feedback": feedback
#             }
#         }}
#     )

#     return jsonify({"feedback": feedback})

from flask import Blueprint, request, jsonify
# from flask_jwt_extended import jwt_required, get_jwt_identity # Commented out
from db import db
from llm import generate_question, evaluate_answer
import uuid

interview_bp = Blueprint("interview", __name__)

# Hardcode a user ID for testing so the DB doesn't crash
TEST_USER_ID = "test_user_123" 

@interview_bp.route("/start", methods=["POST"])
# @jwt_required()  <-- Disabled
def start_interview():
    # user_id = get_jwt_identity() <-- Disabled
    user_id = TEST_USER_ID 
    
    skills = request.json.get("skills", [])
    session_id = str(uuid.uuid4())

    db.sessions.insert_one({
        "session_id": session_id,
        "user_id": user_id,
        "skills": skills,
        "questions": []
    })

    question = generate_question(skills)

    return jsonify({
        "session_id": session_id,
        "question": question
    })


@interview_bp.route("/answer", methods=["POST"])
# @jwt_required() <-- Disabled
def answer_question():
    data = request.json
    session_id = data["session_id"]
    current_question = data["question"]
    answer = data["answer"]

    # 1. Evaluate answer
    feedback = evaluate_answer(current_question, answer)

    # 2. Update DB
    db.sessions.update_one(
        {"session_id": session_id},
        {"$push": {
            "questions": {
                "question": current_question,
                "answer": answer,
                "feedback": feedback
            }
        }}
    )

    # 3. Generate Next Question
    session = db.sessions.find_one({"session_id": session_id})
    skills = session.get("skills", [])
    
    next_question = generate_question(skills)

    return jsonify({
        "feedback": feedback,
        "next_question": next_question
    })