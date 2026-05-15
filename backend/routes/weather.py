from fastapi import APIRouter, Depends, HTTPException
import httpx
import logging

from auth.dependencies import get_current_user
from config.settings import settings

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/")
async def get_weather(
    lat: float,
    lon: float,
    current_user: dict = Depends(get_current_user)
):
    """
    Fetches real-time weather and forecast using OpenWeatherMap API.
    """
    if not settings.OPENWEATHERMAP_API_KEY:
        raise HTTPException(status_code=500, detail="Weather API key not configured")
        
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params={
                    "lat": lat,
                    "lon": lon,
                    "appid": settings.OPENWEATHERMAP_API_KEY,
                    "units": "metric"
                },
                timeout=10.0
            )
            
        if response.status_code != 200:
            logger.error(f"Weather API Error: {response.text}")
            raise HTTPException(status_code=502, detail="Weather service unavailable")
            
        data = response.json()
        return {
            "success": True,
            "temperature": data["main"]["temp"],
            "condition": data["weather"][0]["main"],
            "description": data["weather"][0]["description"],
            "alerts": [] # Implement alerts logic
        }
    except Exception as e:
        logger.error(f"Weather fetch failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
