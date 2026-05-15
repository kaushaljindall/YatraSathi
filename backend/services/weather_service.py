import httpx
import logging
from config.settings import settings

logger = logging.getLogger(__name__)

class WeatherService:
    async def get_live_weather(self, lat: float, lon: float) -> dict:
        """Fetches live weather data from OpenWeatherMap."""
        if not settings.OPENWEATHERMAP_API_KEY:
            logger.warning("Mocking weather due to missing API key")
            return {"status": "rain", "temp": 18, "description": "heavy rain expected"}
            
        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(
                    "https://api.openweathermap.org/data/2.5/weather",
                    params={"lat": lat, "lon": lon, "appid": settings.OPENWEATHERMAP_API_KEY, "units": "metric"},
                    timeout=5.0
                )
                res.raise_for_status()
                data = res.json()
                return {
                    "status": data["weather"][0]["main"].lower(),
                    "temp": data["main"]["temp"],
                    "description": data["weather"][0]["description"]
                }
        except Exception as e:
            logger.error(f"Weather API failed: {e}")
            return {"status": "unknown", "temp": 25, "description": "unavailable"}

weather_service = WeatherService()
