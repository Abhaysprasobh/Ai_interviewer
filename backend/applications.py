from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
import os
from werkzeug.utils import secure_filename
from utils import currentTime
from db import applications_collection,jobs_collection
from auth import user_required, company_required
from datetime import timezone
from resume_scoring import calculate_resume_score

applications_bp = Blueprint("applications", __name__, url_prefix="/api/applications")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ================= APPLY TO JOB =================
@applications_bp.route("/apply", methods=["POST"])
@jwt_required()
@user_required
def apply_job():
    user_id = ObjectId(get_jwt_identity())
    job_id = request.form.get("jobId")
    resume = request.files.get("resume")
    cover_letter = request.form.get("coverLetter")

    if not job_id or not resume:
        return jsonify({"error": "Job ID and resume required"}), 400

    job = jobs_collection.find_one({"_id": ObjectId(job_id), "status": "active"})
    if not job:
        return jsonify({"error": "Job not found or inactive"}), 404

    # 🔒 Prevent re-apply
    existing = applications_collection.find_one({
        "jobId": ObjectId(job_id),
        "userId": user_id
    })

    if existing:
        return jsonify({
            "error": "Already applied",
            "status": existing["status"]
        }), 409

    filename = secure_filename(resume.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    resume.save(filepath)

    now = currentTime()
    # ----------------------------
    # Calculate AI Resume Score
    # ----------------------------
    required_skills = job.get("skills", [])

    score_data = calculate_resume_score(filepath, required_skills)

    # ----------------------------
    # Insert Application
    # ----------------------------
    applications_collection.insert_one({
        "jobId": ObjectId(job_id),
        "companyId": job["companyId"],
        "userId": user_id,

        "resumeUrl": filepath,
        "coverLetter": cover_letter,

        "status": "submitted",
        "statusHistory": [
            {"status": "submitted", "at": now}
        ],

        "aiResumeScore": score_data["resume_score"],
        "aiInterviewScore": None,

        "aiScoreBreakdown": {
            "skillMatch": score_data["skill_match"],
            "experienceMatch": score_data["experience_match"],
            "educationMatch": score_data["education_match"]
        },

        "appliedAt": now,
        "updatedAt": now
    })

    return jsonify({"message": "Application submitted"}), 201


# ================= USER APPLICATIONS =================
@applications_bp.route("/my-applications", methods=["GET"])
@jwt_required()
@user_required
def my_applications():
    user_id = ObjectId(get_jwt_identity())

    pipeline = [
        # 1️⃣ Match user applications
        {"$match": {"userId": user_id}},

        # 2️⃣ Lookup Job
        {"$lookup": {
            "from": "jobs",
            "localField": "jobId",
            "foreignField": "_id",
            "as": "job"
        }},
        {"$unwind": "$job"},

        #  Lookup Company using job.companyId
        {"$lookup": {
            "from": "company",
            "localField": "job.companyId",
            "foreignField": "_id",
            "as": "company"
        }},
        {"$unwind": {
            "path": "$company",
            "preserveNullAndEmptyArrays": True
        }},

        #  Final projection (IMPORTANT FIX)
        {"$project": {
            "_id": 1,
            "status": 1,
            "appliedAt": 1,
            "aiResumeScore": 1,
            "aiInterviewScore": 1,
            "interviewSummary": 1,
            "interviewDetails": 1,
            "proctoring_flag": 1,
            "proctoring_reason": 1,

            "job": {
                "_id": "$job._id",
                "title": "$job.title"
            },

            "company": {
                "_id": "$company._id",
                "name": "$company.name"
            }
        }}
    ]

    #  Serialize ObjectIds
    results = []
    for app in applications_collection.aggregate(pipeline):
        app["_id"] = str(app["_id"])
        app["job"]["_id"] = str(app["job"]["_id"])

        if app.get("company") and app["company"].get("_id"):
            app["company"]["_id"] = str(app["company"]["_id"])
        else:
            app["company"] = None

        results.append(app)

    return jsonify(results), 200


# ================= COMPANY: JOB APPLICANTS =================
@applications_bp.route("/job/<job_id>", methods=["GET"])
@jwt_required()
@company_required
def job_applicants(job_id):
    company_id = ObjectId(get_jwt_identity())

    job_oid = ObjectId(job_id)

    pipeline = [
        {"$match": {
            "jobId": job_oid,
            "companyId": company_id
        }},
        {"$lookup": {
            "from": "users",
            "localField": "userId",
            "foreignField": "_id",
            "as": "user"
        }},
        {"$unwind": "$user"},
        {"$project": {
            "_id": 1,
            "status": 1,
            "appliedAt": 1,
            "resumeUrl": 1,
            "aiResumeScore": 1,
            "aiInterviewScore": 1,
            "interviewSummary": 1,
            "interviewDetails": 1,
            "proctoring_flag": 1,
            "proctoring_reason": 1,
            "user": {
                "_id": "$user._id",
                "fullName": "$user.fullName",
                "email": "$user.email",
                "mobile": "$user.mobile"
            }
        }}
    ]

    results = []
    for app in applications_collection.aggregate(pipeline):
        app["_id"] = str(app["_id"])
        app["user"]["_id"] = str(app["user"]["_id"])
        results.append(app)

    return jsonify(results), 200


# # ================= APPLICATION DETAILS =================
# @applications_bp.route("/<app_id>", methods=["GET"])
# @jwt_required()
# def get_application(app_id):
    pipeline = [
        {"$match": {"_id": ObjectId(app_id)}},

        {"$lookup": {
            "from": "users",
            "localField": "userId",
            "foreignField": "_id",
            "as": "user"
        }},
        {"$unwind": "$user"},

        {"$lookup": {
            "from": "jobs",
            "localField": "jobId",
            "foreignField": "_id",
            "as": "job"
        }},
        {"$unwind": "$job"}
    ]

    data = list(applications_collection.aggregate(pipeline))
    if not data:
        return jsonify({"error": "Application not found"}), 404

    app = data[0]
    app["_id"] = str(app["_id"])
    app["user"]["_id"] = str(app["user"]["_id"])
    app["job"]["_id"] = str(app["job"]["_id"])

    return jsonify(app), 200


# ================= UPDATE STATUS =================
@applications_bp.route("/<app_id>/status", methods=["PUT"])
@jwt_required()
@company_required
def update_status(app_id):
    status = request.json.get("status")

    allowed = [
        "submitted",
        "reviewed",
        "shortlisted",
        "rejected",
        "interview_scheduled",
        "interview_completed"
    ]

    if status not in allowed:
        return jsonify({"error": "Invalid status"}), 400

    result = applications_collection.update_one(
        {"_id": ObjectId(app_id)},
        {"$set": {"status": status}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Application not found"}), 404

    return jsonify({"message": "Status updated"}), 200


# GET APPLICATION DETAILS (Company + User)
@applications_bp.route("/<app_id>", methods=["GET"])
@jwt_required()
def get_application(app_id):
    pipeline = [
        {"$match": {"_id": ObjectId(app_id)}},

        # Join user
        {"$lookup": {
            "from": "users",
            "localField": "userId",
            "foreignField": "_id",
            "as": "user"
        }},
        {"$unwind": "$user"},

        # Join job
        {"$lookup": {
            "from": "jobs",
            "localField": "jobId",
            "foreignField": "_id",
            "as": "job"
        }},
        {"$unwind": "$job"},

        # Shape response for frontend
        {"$project": {
            "_id": 1,
            "status": 1,
            "appliedAt": 1,
            "resumeUrl": 1,
            "coverLetter": 1,
            "aiResumeScore": 1,
            "aiInterviewScore": 1,

            "user": {
                "_id": "$user._id",
                "fullName": "$user.fullName",
                "email": "$user.email",
                "mobile": "$user.mobile"
            },

            "job": {
                "_id": "$job._id",
                "title": "$job.title"
            }
        }}
    ]

    result = list(applications_collection.aggregate(pipeline))

    if not result:
        return jsonify({"error": "Application not found"}), 404

    app = result[0]

    # stringify ObjectIds
    app["_id"] = str(app["_id"])
    app["user"]["_id"] = str(app["user"]["_id"])
    app["job"]["_id"] = str(app["job"]["_id"])

    return jsonify(app), 200


# ================= BULK APPLICATION STATUS UPDATE =================
@applications_bp.route("/job/<job_id>/bulk/status", methods=["PUT"])
@jwt_required()
@company_required
def bulk_update_application_status(job_id):
    company_id = ObjectId(get_jwt_identity())
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    application_ids = data.get("applicationIds")
    new_status = data.get("status")

    if not isinstance(application_ids, list) or not application_ids:
        return jsonify({"error": "applicationIds must be a non-empty list"}), 400

    allowed_statuses = [
        "submitted",
        "reviewed",
        "shortlisted",
        "rejected",
        "interview_scheduled",
        "interview_completed"
    ]

    if new_status not in allowed_statuses:
        return jsonify({"error": "Invalid status"}), 400

    try:
        job_oid = ObjectId(job_id)
    except:
        return jsonify({"error": "Invalid jobId"}), 400

    # Convert application IDs
    try:
        app_oids = [ObjectId(app_id) for app_id in application_ids]
    except:
        return jsonify({"error": "One or more invalid applicationIds"}), 400

    now = currentTime()

    # 🔒 HARD GUARANTEES:
    # - belongs to this company
    # - belongs to this job
    result = applications_collection.update_many(
        {
            "_id": {"$in": app_oids},
            "jobId": job_oid,
            "companyId": company_id
        },
        {
            "$set": {
                "status": new_status,
                "updatedAt": now
            },
            "$push": {
                "statusHistory": {
                    "status": new_status,
                    "at": now
                }
            }
        }
    )

    if result.matched_count != len(app_oids):
        return jsonify({
            "error": "Some applications do not belong to this job or company"
        }), 403

    return jsonify({
        "message": "Bulk status update completed",
        "jobId": str(job_id),
        "updated": result.modified_count
    }), 200



from flask import send_file
import os
# ================= VIEW RESUME (Display in Browser) =================
@applications_bp.route("/files/view/<path:filepath>", methods=["GET"])
@jwt_required()
def view_file(filepath):
    """Display PDF in browser"""
    user_id = ObjectId(get_jwt_identity())
    
    app = applications_collection.find_one({"resumeUrl": filepath})
    if not app:
        return jsonify({"error": "File not found"}), 404
    
    if app["userId"] != user_id and app["companyId"] != user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    normalized_path = filepath.replace("\\", "/")
    file_path = os.path.join(UPLOAD_FOLDER, os.path.basename(normalized_path))
    
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found on server"}), 404
    
    try:
        return send_file(
            file_path,
            mimetype='application/pdf',  # ← This makes it display
            as_attachment=False           # ← NOT a download
        )
    except Exception as e:
        return jsonify({"error": f"Failed to send file: {str(e)}"}), 500


# ================= DOWNLOAD RESUME (Force Download) =================
@applications_bp.route("/files/download/<path:filepath>", methods=["GET"])
@jwt_required()
def download_file(filepath):
    """Download PDF file"""
    user_id = ObjectId(get_jwt_identity())
    
    app = applications_collection.find_one({"resumeUrl": filepath})
    if not app:
        return jsonify({"error": "File not found"}), 404
    
    if app["userId"] != user_id and app["companyId"] != user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    normalized_path = filepath.replace("\\", "/")
    file_path = os.path.join(UPLOAD_FOLDER, os.path.basename(normalized_path))
    
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found on server"}), 404
    
    try:
        return send_file(
            file_path,
            as_attachment=True,           # ← This forces download
            download_name=os.path.basename(file_path)
        )
    except Exception as e:
        return jsonify({"error": f"Failed to send file: {str(e)}"}), 500