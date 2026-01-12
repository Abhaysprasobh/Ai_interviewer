from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from db import jobs_collection
from auth import company_required
from datetime import datetime

jobs_bp = Blueprint("jobs", __name__, url_prefix="/api/jobs")


# CREATE JOB
@jobs_bp.route("", methods=["POST"])
@jwt_required()
@company_required
def create_job():
    data = request.json
    company_id = get_jwt_identity()

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


# GET ALL JOBS (PUBLIC)
@jobs_bp.route("", methods=["GET"])
def get_all_jobs():
    jobs = []
    for job in jobs_collection.find({"status": "active"}):
        job["_id"] = str(job["_id"])
        job["companyId"] = str(job["companyId"])
        jobs.append(job)
    return jsonify(jobs)


# GET JOB BY ID
@jobs_bp.route("/<job_id>", methods=["GET"])
def get_job(job_id):
    job = jobs_collection.find_one({"_id": ObjectId(job_id)})
    if not job:
        return jsonify({"error": "Job not found"}), 404

    job["_id"] = str(job["_id"])
    job["companyId"] = str(job["companyId"])
    return jsonify(job)


# GET COMPANY JOBS
@jobs_bp.route("/company/my-jobs", methods=["GET"])
@jwt_required()
@company_required
def my_jobs():
    company_id = get_jwt_identity()
    jobs = []

    for job in jobs_collection.find({"companyId": ObjectId(company_id)}):
        job["_id"] = str(job["_id"])
        job["companyId"] = str(job["companyId"])
        jobs.append(job)

    return jsonify(jobs)


# UPDATE JOB
@jobs_bp.route("/<job_id>", methods=["PUT"])
@jwt_required()
@company_required
def update_job(job_id):
    data = request.json
    company = get_jwt_identity()

    result = jobs_collection.update_one(
        {"_id": ObjectId(job_id), "companyId": ObjectId(company["id"])},
        {"$set": data}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Job not found or unauthorized"}), 404

    return jsonify({"message": "Job updated"})


# DELETE JOB
@jobs_bp.route("/<job_id>", methods=["DELETE"])
@jwt_required()
@company_required
def delete_job(job_id):
    company = get_jwt_identity()
    result = jobs_collection.delete_one({
        "_id": ObjectId(job_id),
        "companyId": ObjectId(company["id"])
    })

    if result.deleted_count == 0:
        return jsonify({"error": "Job not found or unauthorized"}), 404

    return jsonify({"message": "Job deleted"})
