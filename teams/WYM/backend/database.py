"""
Database — MongoDB connection via Motor (async driver)
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "aegis_kinetic_archive")

client: AsyncIOMotorClient = None
db = None


async def connect_to_mongo():
    """Initialize the MongoDB connection."""
    global client, db
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[MONGODB_DB_NAME]
    # Verify the connection
    await client.admin.command("ping")
    print(f"Connected to MongoDB: {MONGODB_DB_NAME}")


async def close_mongo_connection():
    """Close the MongoDB connection."""
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed.")


def get_database():
    """Return the database instance."""
    return db
