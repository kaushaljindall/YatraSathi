import json
import os
import asyncio
import aiofiles
from typing import Dict, Any

# Correct path pointing to existing database.json
DB_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "database.json")

INITIAL_SCHEMA: Dict[str, Any] = {
    "users": [],
    "trips": [],
    "expenses": [],
    "itineraries": [],
    "rag_cache": {}
}

# Ensure data directory and database file exist with correct schema
os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
if not os.path.exists(DB_FILE):
    with open(DB_FILE, "w") as f:
        json.dump(INITIAL_SCHEMA, f, indent=2)
else:
    # Migrate: if existing file has wrong schema (dicts instead of lists), reset it
    try:
        with open(DB_FILE, "r") as f:
            existing = json.load(f)
        needs_migration = (
            not isinstance(existing.get("users"), list)
            or not isinstance(existing.get("trips"), list)
            or not isinstance(existing.get("expenses"), list)
            or not isinstance(existing.get("itineraries"), list)
            or "users" not in existing
        )
        if needs_migration:
            with open(DB_FILE, "w") as f:
                json.dump(INITIAL_SCHEMA, f, indent=2)
    except (json.JSONDecodeError, Exception):
        with open(DB_FILE, "w") as f:
            json.dump(INITIAL_SCHEMA, f, indent=2)

# Thread-safe async lock
db_lock = asyncio.Lock()


async def read_db() -> Dict[str, Any]:
    """Non-blocking async database read."""
    async with db_lock:
        async with aiofiles.open(DB_FILE, "r", encoding="utf-8") as f:
            content = await f.read()
            return json.loads(content)


async def write_db(data: Dict[str, Any]) -> None:
    """Non-blocking async database write with atomic replace."""
    async with db_lock:
        tmp_path = DB_FILE + ".tmp"
        async with aiofiles.open(tmp_path, "w", encoding="utf-8") as f:
            await f.write(json.dumps(data, indent=2, ensure_ascii=False))
        os.replace(tmp_path, DB_FILE)


async def get_db():
    """FastAPI dependency to provide DB access in routes."""
    yield None
