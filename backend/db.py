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

    # Test connection
    client.admin.command("ping")
    print("Successfully connected to MongoDB")

except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
