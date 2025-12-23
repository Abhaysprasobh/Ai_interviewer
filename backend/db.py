from pymongo import MongoClient

try:
    client = MongoClient(
        "mongodb://127.0.0.1:27017/",
        serverSelectionTimeoutMS=3000
    )
    client.server_info()  # 🔴 forces connection check
    db = client.ai_interviewer
    print("MongoDB connected successfully")
except Exception as e:
    print("MongoDB connection failed:", e)
    db = None

