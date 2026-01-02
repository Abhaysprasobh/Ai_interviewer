from pymongo import MongoClient
from config import MONGO_URI

try:
    client = MongoClient(MONGO_URI)
    db = client.ai_interviewer

    client.admin.command('ping')
    print("Successfully connected to MongoDB")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")

