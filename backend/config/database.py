import json
import os
import asyncio
from typing import Dict, Any

DB_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "db.json")

# Ensure data directory and db file exist
os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
if not os.path.exists(DB_FILE):
    with open(DB_FILE, "w") as f:
        json.dump({"users": [], "trips": [], "expenses": [], "itineraries": []}, f)

# Basic lock to prevent concurrent write collisions in async environment
db_lock = asyncio.Lock()

async def read_db() -> Dict[str, Any]:
    async with db_lock:
        with open(DB_FILE, "r") as f:
            return json.load(f)

async def write_db(data: Dict[str, Any]):
    async with db_lock:
        with open(DB_FILE, "w") as f:
            json.dump(data, f, indent=4)

async def get_db():
    """Dependency to provide database access if needed in routes"""
    yield None
