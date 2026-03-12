from flask import Blueprint, request, jsonify
from db import db
from llm import generate_question, evaluate_answer, generate_dashboard_summary
from scoring import compute_qa_score
import uuid

interview_bp = Blueprint("interview", __name__)

TEST_USER_ID = "test_user_123" 
MAX_QUESTIONS = 3

from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId # Assuming you are using MongoDB
# Make sure to import your mongo db instance, e.g., from app import mongo

@interview_bp.route('/abort', methods=['POST'])
# @jwt_required()
def abort_interview():
    """
    Catches proctoring violations (like exiting full screen) 
    and instantly fails the candidate's application in the database.
    """
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        application_id = data.get('application_id')
        reason = data.get('reason', 'Proctoring Violation')
        questions_completed = data.get('questions_completed', 0)

        print(f"🚨 PROCTORING FLAG: User {current_user} aborted. Reason: {reason}")

        # If this was just a practice run (no application_id), just return success
        if not application_id:
            return jsonify({"message": "Practice interview aborted."}), 200

        # If it's a real job application, update MongoDB to fail them
        # Adjust 'mongo.db.applications' to match your actual database variable
        db.applications.update_one(
            {"_id": ObjectId(application_id)},
            {"$set": {
                "status": "Rejected", # Or "Failed", depending on your system
                "proctoring_flag": True,
                "proctoring_reason": reason,
                "interview_score": 0,
                "notes": f"Auto-rejected by system. Completed {questions_completed} questions before violation."
            }}
        )

        return jsonify({"message": "Interview aborted and database updated."}), 200

    except Exception as e:
        print(f"Error aborting interview: {e}")
        return jsonify({"error": "Internal server error during abort"}), 500

@interview_bp.route("/start", methods=["POST"])
def start_interview():
    data = request.json
    role = data.get("role", "Software Engineer")
    skills = data.get("skills", [])
    experience = data.get("experience", "")
    education = data.get("education", "")
    application_id = data.get("application_id")
    
    session_id = str(uuid.uuid4())
    context = {"role": role, "skills": skills, "experience": experience, "education": education}
    
    q_data = generate_question(context, history=[])

    db.sessions.insert_one({
        "session_id": session_id,
        "user_id": TEST_USER_ID,
        "application_id": application_id,
        "role": role,           
        "skills": skills,
        "experience": experience, 
        "education": education,   
        "questions_history": [],
        "detailed_results": [],  
        "current_question_data": q_data,
        "current_question_count": 1, 
        "max_questions": MAX_QUESTIONS
    })

    return jsonify({
        "session_id": session_id,
        "question": q_data["question"],
        "question_number": 1,
        "total_questions": MAX_QUESTIONS
    })


@interview_bp.route("/answer", methods=["POST"])
def answer_question():
    data = request.json
    session_id = data["session_id"]
    answer = data["answer"]

    session = db.sessions.find_one({"session_id": session_id})
    current_q_data = session.get("current_question_data")
    current_question = current_q_data["question"]
    expected_answer = current_q_data["expected_answer"]
    keywords = current_q_data["keywords"]
    application_id = session.get("application_id")

    # --- HYBRID SCORING ENGINE ---
    
    # 2A. Lexical / Deterministic Score (from your scoring.py)
    # Returns a dict. We want the 'normalized' 0-10 float.
    lexical_eval = compute_qa_score(expected_answer, answer, keywords)
    lexical_score = lexical_eval["normalized"] 

    # 2B. Semantic Score (from llm.py)
    semantic_eval = evaluate_answer(current_question, answer)
    semantic_tech_score = semantic_eval.get("technical_score", 0)
    semantic_comm_score = semantic_eval.get("communication_score", 0)
    
    # 2C. Blend the Technical Scores (e.g., 60% LLM understanding, 40% keyword/sequence match)
    blended_tech_score = round((0.6 * semantic_tech_score) + (0.4 * lexical_score), 1)

    # 3. Save the result to the database
    result_record = {
        "question": current_question,
        "answer": answer,
        "expected_answer": expected_answer,
        "keywords_checked": keywords,
        "lexical_score": round(lexical_score, 1),
        "semantic_tech_score": semantic_tech_score,
        "final_technical_score": blended_tech_score,
        "communication_score": semantic_comm_score,
        "feedback": semantic_eval.get("feedback", "")
    }

    db.sessions.update_one(
        {"session_id": session_id},
        {"$push": {
            "detailed_results": result_record,
            "questions_history": current_question
        }}
    )

    current_count = session.get("current_question_count", 1)

    # 4. Check if interview is over
    if current_count >= MAX_QUESTIONS:
        all_results = session.get("detailed_results", []) + [result_record] # Include current
        total_tech = sum(r["final_technical_score"] for r in all_results)
        total_comm = sum(r["communication_score"] for r in all_results)
        
        overall_percentage = int(((total_tech + total_comm) / (MAX_QUESTIONS * 20)) * 100)
        ai_summary = generate_dashboard_summary(all_results)

                # --- Save successful score AND details to Application Database ---
        if application_id:
            db.applications.update_one(
                {"_id": ObjectId(application_id)},
                {"$set": {
                    "aiInterviewScore": overall_percentage, # Match your ATS schema
                    "interviewSummary": ai_summary,         # Save the AI paragraph
                    "interviewDetails": all_results,        # Save the Q&A array
                    "status": "interview_completed",        # Match your allowed ATS statuses
                    "proctoring_flag": False 
                }}
            )

        return jsonify({
            "is_complete": True,
            "feedback": result_record["feedback"],
            "dashboard": {
                "overall_score_percentage": overall_percentage,
                "average_technical": round(total_tech / MAX_QUESTIONS, 1),
                "average_communication": round(total_comm / MAX_QUESTIONS, 1),
                "summary": ai_summary,
                "detailed_breakdown": all_results
            }
        })

    # 5. Generate Next Question
    context = {
        "role": session.get("role"),
        "skills": session.get("skills"),
        "experience": session.get("experience")
    }
    
    history = session.get("questions_history", []) + [current_question]
    next_q_data = generate_question(context, history=history)
    
    # Update DB for the next round
    db.sessions.update_one(
        {"session_id": session_id}, 
        {
            "$set": {"current_question_data": next_q_data},
            "$inc": {"current_question_count": 1}
        }
    )

    return jsonify({
        "is_complete": False,
        "feedback": result_record["feedback"],
        "next_question": next_q_data["question"],
        "question_number": current_count + 1,
        "total_questions": MAX_QUESTIONS
    })



















# from flask import Blueprint, request, jsonify
# # from flask_jwt_extended import jwt_required, get_jwt_identity
# from db import db
# from llm import generate_question, evaluate_answer
# import uuid

# interview_bp = Blueprint("interview", __name__)

# TEST_USER_ID = "test_user_123" 

# @interview_bp.route("/start", methods=["POST"])
# def start_interview():
#     user_id = TEST_USER_ID 
#     data = request.json
    
#     # 1. Extract ALL new fields from frontend
#     role = data.get("role", "Software Engineer")
#     skills = data.get("skills", [])
#     experience = data.get("experience", "")
#     education = data.get("education", "")
    
#     session_id = str(uuid.uuid4())

#     # 2. Store EVERYTHING in the DB
#     # This ensures the bot remembers the context for question #2, #3, etc.
#     db.sessions.insert_one({
#         "session_id": session_id,
#         "user_id": user_id,
#         "role": role,           # <--- New
#         "skills": skills,
#         "experience": experience, # <--- New
#         "education": education,   # <--- New
#         "questions": []
#     })

#     # 3. Create a Context Object for the LLM
#     context = {
#         "role": role,
#         "skills": skills,
#         "experience": experience,
#         "education": education
#     }

#     # 4. Generate Question based on full context
#     question = generate_question(context)

#     return jsonify({
#         "session_id": session_id,
#         "question": question
#     })


# @interview_bp.route("/answer", methods=["POST"])
# def answer_question():
#     data = request.json
#     session_id = data["session_id"]
#     current_question = data["question"]
#     answer = data["answer"]

#     # Evaluate answer
#     feedback = evaluate_answer(current_question, answer)

#     # Update DB with the Q&A pair
#     db.sessions.update_one(
#         {"session_id": session_id},
#         {"$push": {
#             "questions": {
#                 "question": current_question,
#                 "answer": answer,
#                 "feedback": feedback
#             }
#         }}
#     )

#     # --- GENERATE NEXT QUESTION ---
#     # 1. Retrieve the session to get the user's details again
#     session = db.sessions.find_one({"session_id": session_id})
    
#     # 2. Re-build the context
#     context = {
#         "role": session.get("role", "Software Engineer"),
#         "skills": session.get("skills", []),
#         "experience": session.get("experience", ""),
#         "education": session.get("education", "")
#     }
    
#     # 3. Generate tailored next question
#     next_question = generate_question(context)

#     return jsonify({
#         "feedback": feedback,
#         "next_question": next_question
#     })