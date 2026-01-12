from flask import Blueprint, request, jsonify
# from flask_jwt_extended import jwt_required, get_jwt_identity
from db import db
from llm import generate_question, evaluate_answer
import uuid

interview_bp = Blueprint("interview", __name__)

TEST_USER_ID = "test_user_123" 

@interview_bp.route("/start", methods=["POST"])
def start_interview():
    user_id = TEST_USER_ID 
    data = request.json
    
    # 1. Extract ALL new fields from frontend
    role = data.get("role", "Software Engineer")
    skills = data.get("skills", [])
    experience = data.get("experience", "")
    education = data.get("education", "")
    
    session_id = str(uuid.uuid4())

    # 2. Store EVERYTHING in the DB
    # This ensures the bot remembers the context for question #2, #3, etc.
    db.sessions.insert_one({
        "session_id": session_id,
        "user_id": user_id,
        "role": role,           # <--- New
        "skills": skills,
        "experience": experience, # <--- New
        "education": education,   # <--- New
        "questions": []
    })

    # 3. Create a Context Object for the LLM
    context = {
        "role": role,
        "skills": skills,
        "experience": experience,
        "education": education
    }

    # 4. Generate Question based on full context
    question = generate_question(context)

    return jsonify({
        "session_id": session_id,
        "question": question
    })


@interview_bp.route("/answer", methods=["POST"])
def answer_question():
    data = request.json
    session_id = data["session_id"]
    current_question = data["question"]
    answer = data["answer"]

    # Evaluate answer
    feedback = evaluate_answer(current_question, answer)

    # Update DB with the Q&A pair
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

    # --- GENERATE NEXT QUESTION ---
    # 1. Retrieve the session to get the user's details again
    session = db.sessions.find_one({"session_id": session_id})
    
    # 2. Re-build the context
    context = {
        "role": session.get("role", "Software Engineer"),
        "skills": session.get("skills", []),
        "experience": session.get("experience", ""),
        "education": session.get("education", "")
    }
    
    # 3. Generate tailored next question
    next_question = generate_question(context)

    return jsonify({
        "feedback": feedback,
        "next_question": next_question
    })