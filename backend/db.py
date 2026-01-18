from pymongo import MongoClient
from config import MONGO_URI
import certifi

try:
    client = MongoClient(
        MONGO_URI,
        tls=True,
        tlsCAFile=certifi.where()
    )

    db = client.ai_interviewer
    jobs_collection = db.jobs
    applications_collection = db.applications
    # reject at db level run once 
    applications_collection.create_index(
        [("jobId", 1), ("userId", 1)],
        unique=True
    )


    users_collection = db.users
    
    companies_collection = db.companies
    # Test connection
    client.admin.command("ping")
    print("Successfully connected to MongoDB")

except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
