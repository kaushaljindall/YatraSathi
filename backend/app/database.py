import os
from tinydb import TinyDB, Query
import logging

logger = logging.getLogger(__name__)

# Make sure data directory exists
os.makedirs("data", exist_ok=True)

# Initialize a TinyDB instance inside a local data folder
db_path = os.path.join("data", "database.json")
try:
    db = TinyDB(db_path)
    logger.info("Initialized TinyDB JSON database.")
except Exception as e:
    logger.error(f"Failed to initialize database: {e}")
    db = None

def get_db():
    """Dependency to provide a database instance."""
    yield db
