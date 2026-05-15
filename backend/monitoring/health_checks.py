import os
from fastapi import APIRouter
from datetime import datetime
from config.database import read_db

router = APIRouter()

@router.get("/health")
async def health():
    """Primary health check: verifies JSON DB and environment."""
    try:
        await read_db()
        db_status = "ok"
    except Exception:
        db_status = "error"

    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "checks": {
            "json_database": db_status,
            "environment": "ok" if os.environ.get("SECRET_KEY") else "missing_secrets",
        },
    }

@router.get("/health/ai")
async def ai_health():
    """Verifies AI service credentials are configured."""
    groq_key = os.environ.get("GROQ_API_KEY", "")
    weather_key = os.environ.get("OPENWEATHERMAP_API_KEY", "")
    return {
        "groq_api": "configured" if groq_key and groq_key != "your_groq_api_key_here" else "missing",
        "weather_api": "configured" if weather_key else "missing",
        "faiss_index": "local",
    }
