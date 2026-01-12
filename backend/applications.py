from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from db import applications_collection
from auth import user_required, company_required
from datetime import datetime
import os
from werkzeug.utils import secure_filename

applications_bp = Blueprint("applications", __name__, url_prefix="/api/applications")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# APPLY TO JOB
@applications_bp.route("/apply", methods=["POST"])
@jwt_required()
@user_required
def apply_job():
    user_id = get_jwt_identity()

    job_id = request.form.get("jobId")
    resume = request.files.get("resume")
    cover_letter = request.form.get("coverLetter")

    if not resume:
        return jsonify({"error": "Resume required"}), 400

    filename = secure_filename(resume.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    resume.save(filepath)

    application = {
        "jobId": ObjectId(job_id),
        "userId": ObjectId(user_id),
        "resumeUrl": filepath,
        "coverLetter": cover_letter,
        "status": "submitted",
        "aiResumeScore": None,
        "aiInterviewScore": None,
        "appliedAt": datetime.utcnow()
    }

    applications_collection.insert_one(application)
    return jsonify({"message": "Application submitted"}), 201


# GET USER APPLICATIONS
@applications_bp.route("/my-applications", methods=["GET"])
@jwt_required()
@user_required
def my_applications():
    user_id = get_jwt_identity()
    apps = []

    for app in applications_collection.find({"userId": ObjectId(user_id)}):
        app["_id"] = str(app["_id"])
        app["jobId"] = str(app["jobId"])
        app["userId"] = str(app["userId"])
        apps.append(app)

    return jsonify(apps)



# GET JOB APPLICANTS
@applications_bp.route("/job/<job_id>", methods=["GET"])
@jwt_required()
@company_required
def job_applicants(job_id):
    apps = []

    for app in applications_collection.find({"jobId": ObjectId(job_id)}):
        app["_id"] = str(app["_id"])
        app["jobId"] = str(app["jobId"])
        app["userId"] = str(app["userId"])
        apps.append(app)

    return jsonify(apps)


# UPDATE APPLICATION STATUS
@applications_bp.route("/<app_id>/status", methods=["PUT"])
@jwt_required()
@company_required
def update_status(app_id):
    status = request.json.get("status")

    valid_status = [
        "submitted",
        "reviewed",
        "shortlisted",
        "rejected",
        "interview_scheduled",
        "interview_completed"
    ]

    if status not in valid_status:
        return jsonify({"error": "Invalid status"}), 400

    result = applications_collection.update_one(
        {"_id": ObjectId(app_id)},
        {"$set": {"status": status}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Application not found"}), 404

    return jsonify({"message": "Status updated"})


# GET APPLICATION DETAILS
@applications_bp.route("/<app_id>", methods=["GET"])
@jwt_required()
def get_application(app_id):
    app = applications_collection.find_one({"_id": ObjectId(app_id)})
    if not app:
        return jsonify({"error": "Application not found"}), 404

    app["_id"] = str(app["_id"])
    app["jobId"] = str(app["jobId"])
    app["userId"] = str(app["userId"])
    return jsonify(app)
