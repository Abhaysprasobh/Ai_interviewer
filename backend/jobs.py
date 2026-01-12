from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime

from db import jobs_collection
from auth import company_required

jobs_bp = Blueprint("jobs", __name__, url_prefix="/api/jobs")


# ================= CREATE JOB =================
@jobs_bp.route("", methods=["POST"])
@jwt_required()
@company_required
def create_job():
    company_id = get_jwt_identity()
    data = request.json

    job = {
        "companyId": ObjectId(company_id),
        "title": data["title"],
        "description": data["description"],
        "location": data.get("location"),
        "skills": data.get("skills", []),
        "experience": data.get("experience"),
        "salary": data.get("salary"),
        "status": "active",
        "createdAt": datetime.utcnow()
    }

    result = jobs_collection.insert_one(job)
    job["_id"] = str(result.inserted_id)
    job["companyId"] = str(job["companyId"])

    return jsonify(job), 201


# ================= PUBLIC JOB LIST =================
@jobs_bp.route("", methods=["GET"])
def get_all_jobs():
    jobs = []
    for job in jobs_collection.find({"status": "active"}):
        job["_id"] = str(job["_id"])
        job["companyId"] = str(job["companyId"])
        jobs.append(job)

    return jsonify(jobs), 200


# ================= JOB DETAILS =================
@jobs_bp.route("/<job_id>", methods=["GET"])
def get_job(job_id):
    pipeline = [
        {"$match": {"_id": ObjectId(job_id)}},

        {"$lookup": {
            "from": "company",
            "localField": "companyId",
            "foreignField": "_id",
            "as": "company"
        }},
        {"$unwind": "$company"},

        {"$project": {
            "_id": 1,
            "title": 1,
            "description": 1,
            "skills": 1,
            "experience": 1,
            "salary": 1,
            "location": 1,
            "status": 1,
            "createdAt": 1,
            "companyId": {
                "_id": "$company._id",
                "companyName": "$company.companyName",
                "website": "$company.website"
            }
        }}
    ]

    data = list(jobs_collection.aggregate(pipeline))
    if not data:
        return jsonify({"error": "Job not found"}), 404

    job = data[0]
    job["_id"] = str(job["_id"])
    job["companyId"]["_id"] = str(job["companyId"]["_id"])

    return jsonify(job), 200


# ================= COMPANY JOBS (WITH COUNTS) =================
@jobs_bp.route("/company/my-jobs", methods=["GET"])
@jwt_required()
@company_required
def my_jobs():
    company_id = ObjectId(get_jwt_identity())

    pipeline = [
        {"$match": {"companyId": company_id}},
        {"$lookup": {
            "from": "applications",
            "localField": "_id",
            "foreignField": "jobId",
            "as": "applications"
        }},
        {"$addFields": {
            "applicationCount": {"$size": "$applications"}
        }},
        {"$project": {"applications": 0}}
    ]

    jobs = []
    for job in jobs_collection.aggregate(pipeline):
        job["_id"] = str(job["_id"])
        job["companyId"] = str(job["companyId"])
        jobs.append(job)

    return jsonify(jobs), 200


# ================= UPDATE JOB =================
@jobs_bp.route("/<job_id>", methods=["PUT"])
@jwt_required()
@company_required
def update_job(job_id):
    company_id = get_jwt_identity()
    data = request.json

    result = jobs_collection.update_one(
        {"_id": ObjectId(job_id), "companyId": ObjectId(company_id)},
        {"$set": data}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Job not found or unauthorized"}), 404

    return jsonify({"message": "Job updated"}), 200


# ================= DELETE JOB =================
@jobs_bp.route("/<job_id>", methods=["DELETE"])
@jwt_required()
@company_required
def delete_job(job_id):
    company_id = get_jwt_identity()

    result = jobs_collection.delete_one({
        "_id": ObjectId(job_id),
        "companyId": ObjectId(company_id)
    })

    if result.deleted_count == 0:
        return jsonify({"error": "Job not found or unauthorized"}), 404

    return jsonify({"message": "Job deleted"}), 200
