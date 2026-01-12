from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
import os
from werkzeug.utils import secure_filename

from db import applications_collection
from auth import user_required, company_required

applications_bp = Blueprint("applications", __name__, url_prefix="/api/applications")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ================= APPLY TO JOB =================
@applications_bp.route("/apply", methods=["POST"])
@jwt_required()
@user_required
def apply_job():
    user_id = get_jwt_identity()  # string
    job_id = request.form.get("jobId")
    resume = request.files.get("resume")
    cover_letter = request.form.get("coverLetter")

    if not job_id or not resume:
        return jsonify({"error": "Job ID and resume required"}), 400

    filename = secure_filename(resume.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    resume.save(filepath)

    applications_collection.insert_one({
        "jobId": ObjectId(job_id),
        "userId": ObjectId(user_id),
        "resumeUrl": filepath,
        "coverLetter": cover_letter,
        "status": "submitted",
        "aiResumeScore": None,
        "aiInterviewScore": None,
        "appliedAt": datetime.utcnow()
    })

    return jsonify({"message": "Application submitted"}), 201


# ================= USER APPLICATIONS =================
@applications_bp.route("/my-applications", methods=["GET"])
@jwt_required()
@user_required
def my_applications():
    user_id = get_jwt_identity()

    pipeline = [
        {"$match": {"userId": ObjectId(user_id)}},

        {"$lookup": {
            "from": "jobs",
            "localField": "jobId",
            "foreignField": "_id",
            "as": "job"
        }},
        {"$unwind": "$job"},

        {"$lookup": {
            "from": "company",
            "localField": "job.companyId",
            "foreignField": "_id",
            "as": "company"
        }},
        {"$unwind": "$company"},

        {"$project": {
            "_id": 1,
            "status": 1,
            "appliedAt": 1,
            "aiResumeScore": 1,
            "aiInterviewScore": 1,
            "job": {
                "_id": "$job._id",
                "title": "$job.title",
                "companyName": "$company.companyName"
            }
        }}
    ]

    results = []
    for app in applications_collection.aggregate(pipeline):
        app["_id"] = str(app["_id"])
        app["job"]["_id"] = str(app["job"]["_id"])
        results.append(app)

    return jsonify(results), 200


# ================= COMPANY: JOB APPLICANTS =================
@applications_bp.route("/job/<job_id>", methods=["GET"])
@jwt_required()
@company_required
def job_applicants(job_id):
    pipeline = [
        {"$match": {"jobId": ObjectId(job_id)}},

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
            "coverLetter": 1,
            "aiResumeScore": 1,
            "aiInterviewScore": 1,
            "user": {
                "_id": "$user._id",
                "fullName": "$user.fullName",
                "email": "$user.email",
                "mobile": "$user.mobile"
            }
        }}
    ]

    applicants = []
    for app in applications_collection.aggregate(pipeline):
        app["_id"] = str(app["_id"])
        app["user"]["_id"] = str(app["user"]["_id"])
        applicants.append(app)

    return jsonify(applicants), 200


# # ================= APPLICATION DETAILS =================
# @applications_bp.route("/<app_id>", methods=["GET"])
# @jwt_required()
# def get_application(app_id):
#     pipeline = [
#         {"$match": {"_id": ObjectId(app_id)}},

#         {"$lookup": {
#             "from": "users",
#             "localField": "userId",
#             "foreignField": "_id",
#             "as": "user"
#         }},
#         {"$unwind": "$user"},

#         {"$lookup": {
#             "from": "jobs",
#             "localField": "jobId",
#             "foreignField": "_id",
#             "as": "job"
#         }},
#         {"$unwind": "$job"}
#     ]

#     data = list(applications_collection.aggregate(pipeline))
#     if not data:
#         return jsonify({"error": "Application not found"}), 404

#     app = data[0]
#     app["_id"] = str(app["_id"])
#     app["user"]["_id"] = str(app["user"]["_id"])
#     app["job"]["_id"] = str(app["job"]["_id"])

#     return jsonify(app), 200


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
