from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from bson import ObjectId
from utils import currentTime
from db import jobs_collection, applications_collection
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
        "createdAt": currentTime()
    }

    result = jobs_collection.insert_one(job)
    job["_id"] = str(result.inserted_id)
    job["companyId"] = str(job["companyId"])

    return jsonify(job), 201


from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

@jobs_bp.route("", methods=["GET"])
def get_all_jobs():
    user_id = None

    # ✅ Optional JWT (public + logged-in users)
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
        if user_id:
            user_id = ObjectId(user_id)
    except:
        pass

    pipeline = [
        {"$match": {"status": "active"}},

        # Join company (basic info)
        {"$lookup": {
            "from": "company",
            "localField": "companyId",
            "foreignField": "_id",
            "as": "company"
        }},
        {"$unwind": "$company"},
    ]

    # 🔥 Add user application context IF logged in
    if user_id:
        pipeline.extend([
            {"$lookup": {
                "from": "applications",
                "let": {"jobId": "$_id"},
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$and": [
                                    {"$eq": ["$jobId", "$$jobId"]},
                                    {"$eq": ["$userId", user_id]}
                                ]
                            }
                        }
                    }
                ],
                "as": "userApplication"
            }},
            {"$addFields": {
                "userApplication": {"$arrayElemAt": ["$userApplication", 0]}
            }}
        ])
    else:
        pipeline.append({
            "$addFields": {"userApplication": None}
        })

    # Final shape
    pipeline.append({
        "$project": {
            "_id": 1,
            "title": 1,
            "location": 1,
            "skills": 1,
            "createdAt": 1,

            "company": {
                "_id": "$company._id",
                "companyName": "$company.companyName"
            },

            # User-specific flags
            "applied": {
                "$cond": [
                    {"$ifNull": ["$userApplication", False]},
                    True,
                    False
                ]
            },
            "application": {
                "_id": "$userApplication._id",
                "status": "$userApplication.status",
                "aiResumeScore": "$userApplication.aiResumeScore",
                "aiInterviewScore": "$userApplication.aiInterviewScore"
            }
        }
    })

    data = list(jobs_collection.aggregate(pipeline))

    jobs = []
    for job in data:
        job["_id"] = str(job["_id"])
        job["company"]["_id"] = str(job["company"]["_id"])

        if job["application"] and job["application"].get("_id"):
            job["application"]["_id"] = str(job["application"]["_id"])
        else:
            job["application"] = None

        jobs.append(job)

    return jsonify(jobs), 200



@jobs_bp.route("/<job_id>", methods=["GET"])
def get_job(job_id):
    user_id = None
    role = None

    # Optional JWT (public + logged-in users)
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
        claims = get_jwt()
        role = claims.get("role")
    except:
        pass

    pipeline = [
        {"$match": {"_id": ObjectId(job_id)}},

        # Join company
        {"$lookup": {
            "from": "company",
            "localField": "companyId",
            "foreignField": "_id",
            "as": "company"
        }},
        {"$unwind": "$company"},

        # Join application ONLY for logged-in user
        {"$lookup": {
            "from": "applications",
            "let": {"jobId": "$_id"},
            "pipeline": [
                {
                    "$match": {
                        "$expr": {
                            "$and": [
                                {"$eq": ["$jobId", "$$jobId"]},
                                {"$eq": ["$userId", ObjectId(user_id)]} if user_id else {"$eq": [1, 0]}
                            ]
                        }
                    }
                }
            ],
            "as": "userApplication"
        }},

        # Flatten application array
        {"$addFields": {
            "userApplication": {"$arrayElemAt": ["$userApplication", 0]}
        }},

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

            "company": {
                "_id": "$company._id",
                "companyName": "$company.companyName",
                "website": "$company.website"
            },

            # User-specific context
            "userApplication": {
                "_id": "$userApplication._id",
                "status": "$userApplication.status",
                "aiResumeScore": "$userApplication.aiResumeScore",
                "aiInterviewScore": "$userApplication.aiInterviewScore",
                "appliedAt": "$userApplication.appliedAt"
            }
        }}
    ]

    data = list(jobs_collection.aggregate(pipeline))

    if not data:
        return jsonify({"error": "Job not found"}), 404

    job = data[0]

    # stringify IDs
    job["_id"] = str(job["_id"])
    job["company"]["_id"] = str(job["company"]["_id"])

    if job.get("userApplication") and job["userApplication"].get("_id"):
        job["userApplication"]["_id"] = str(job["userApplication"]["_id"])
    else:
        job["userApplication"] = None

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


