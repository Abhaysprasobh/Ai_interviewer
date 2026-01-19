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

        "aiResumeScore": None,
        "aiInterviewScore": None,

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
        {"$match": {"userId": user_id}},

        {"$lookup": {
            "from": "jobs",
            "localField": "jobId",
            "foreignField": "_id",
            "as": "job"
        }},
        {"$unwind": "$job"},

        {"$project": {
            "_id": 1,
            "status": 1,
            "appliedAt": 1,
            "aiResumeScore": 1,
            "aiInterviewScore": 1,

            "job": {
                "_id": "$job._id",
                "title": "$job.title"
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





# ================= BULK APPLICATION STATUS UPDATE =================
@applications_bp.route("/bulk/status", methods=["PUT"])
@jwt_required()
@company_required
def bulk_update_application_status():
    company_id = ObjectId(get_jwt_identity())
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    application_ids = data.get("applicationIds")
    new_status = data.get("status")

    allowed_statuses = [
        "submitted",
        "reviewed",
        "shortlisted",
        "rejected",
        "interview_scheduled",
        "interview_completed"
    ]

    if not application_ids or not isinstance(application_ids, list):
        return jsonify({"error": "applicationIds must be a list"}), 400

    if new_status not in allowed_statuses:
        return jsonify({"error": "Invalid status"}), 400

    object_ids = []
    for app_id in application_ids:
        try:
            object_ids.append(ObjectId(app_id))
        except:
            return jsonify({"error": f"Invalid application id: {app_id}"}), 400
    now = currentTime()
    # Ensure company owns these applications
    result = applications_collection.update_many(
        {
            "_id": {"$in": object_ids},
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

    return jsonify({
        "message": "Bulk status update completed",
        "matched": result.matched_count,
        "modified": result.modified_count
    }), 200



# ================= FILTER + SEARCH APPLICANTS FOR A JOB =================
@applications_bp.route("/jobs/<job_id>", methods=["GET"])
@jwt_required()
@company_required
def get_job_applicants(job_id):
    company_id = ObjectId(get_jwt_identity())

    try:
        job_oid = ObjectId(job_id)
    except:
        return jsonify({"error": "Invalid jobId"}), 400

    # ---------------- Query params ----------------
    status = request.args.get("status")
    search = request.args.get("search")

    min_resume = request.args.get("minResumeScore", type=int)
    max_resume = request.args.get("maxResumeScore", type=int)

    min_interview = request.args.get("minInterviewScore", type=int)
    max_interview = request.args.get("maxInterviewScore", type=int)

    sort_by = request.args.get("sort", "appliedAt")  # appliedAt | aiResumeScore
    order = -1 if request.args.get("order", "desc") == "desc" else 1

    page = max(request.args.get("page", 1, type=int), 1)
    limit = min(request.args.get("limit", 20, type=int), 50)
    skip = (page - 1) * limit

    # ---------------- Base match ----------------
    match = {
        "jobId": job_oid,
        "companyId": company_id
    }

    if status:
        match["status"] = status

    if min_resume is not None or max_resume is not None:
        match["aiResumeScore"] = {}
        if min_resume is not None:
            match["aiResumeScore"]["$gte"] = min_resume
        if max_resume is not None:
            match["aiResumeScore"]["$lte"] = max_resume

    if min_interview is not None or max_interview is not None:
        match["aiInterviewScore"] = {}
        if min_interview is not None:
            match["aiInterviewScore"]["$gte"] = min_interview
        if max_interview is not None:
            match["aiInterviewScore"]["$lte"] = max_interview

    pipeline = [
        {"$match": match},

        # Join user
        {"$lookup": {
            "from": "users",
            "localField": "userId",
            "foreignField": "_id",
            "as": "user"
        }},
        {"$unwind": "$user"}
    ]

    # ---------------- Search ----------------
    if search:
        pipeline.append({
            "$match": {
                "$or": [
                    {"user.fullName": {"$regex": search, "$options": "i"}},
                    {"user.email": {"$regex": search, "$options": "i"}}
                ]
            }
        })

    # ---------------- Sort + paginate ----------------
    pipeline.extend([
        {"$sort": {sort_by: order}},
        {"$skip": skip},
        {"$limit": limit},

        {"$project": {
            "_id": 1,
            "status": 1,
            "appliedAt": 1,
            "aiResumeScore": 1,
            "aiInterviewScore": 1,
            "resumeUrl": 1,

            "user": {
                "_id": "$user._id",
                "fullName": "$user.fullName",
                "email": "$user.email",
                "mobile": "$user.mobile"
            }
        }}
    ])

    results = []
    for app in applications_collection.aggregate(pipeline):
        app["_id"] = str(app["_id"])
        app["user"]["_id"] = str(app["user"]["_id"])
        results.append(app)

    return jsonify({
        "page": page,
        "limit": limit,
        "results": results
    }), 200
