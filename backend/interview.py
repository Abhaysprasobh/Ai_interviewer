from flask import Blueprint, request, jsonify
from db import db
from llm import generate_question, evaluate_answer, generate_dashboard_summary
from scoring import compute_qa_score # Import your custom scoring logic
import uuid

interview_bp = Blueprint("interview", __name__)

TEST_USER_ID = "test_user_123" 
MAX_QUESTIONS = 7

@interview_bp.route("/start", methods=["POST"])
def start_interview():
    data = request.json
    role = data.get("role", "Software Engineer")
    skills = data.get("skills", [])
    experience = data.get("experience", "")
    education = data.get("education", "")
    
    session_id = str(uuid.uuid4())
    context = {"role": role, "skills": skills, "experience": experience, "education": education}
    
    # Generate the first question data (Question, Expected Answer, Keywords)
    q_data = generate_question(context, history=[])

    db.sessions.insert_one({
        "session_id": session_id,
        "user_id": TEST_USER_ID,
        "role": role,           
        "skills": skills,
        "experience": experience, 
        "education": education,   
        "questions_history": [], # Just strings of questions asked
        "detailed_results": [],  # Full Q&A data for the dashboard
        "current_question_data": q_data, # Store the current expected answer/keywords
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

    # 1. Retrieve current session state
    session = db.sessions.find_one({"session_id": session_id})
    current_q_data = session.get("current_question_data")
    current_question = current_q_data["question"]
    expected_answer = current_q_data["expected_answer"]
    keywords = current_q_data["keywords"]

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