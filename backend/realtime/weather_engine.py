from services.weather_service import weather_service

class WeatherEngine:
    async def analyze_impact(self, lat: float, lon: float, activity_type: str) -> dict:
        """Determines if the current weather ruins the planned activity."""
        weather = await weather_service.get_live_weather(lat, lon)
        
        is_outdoor = activity_type.lower() in ["park", "monument", "hiking", "beach"]
        disruptive_weather = ["rain", "storm", "snow", "extreme_heat"]
        
        needs_reschedule = is_outdoor and weather["status"] in disruptive_weather
        
        return {
            "weather": weather,
            "needs_reschedule": needs_reschedule,
            "recommendation": "Switch to indoor museum or cafe" if needs_reschedule else "Proceed as planned"
        }

weather_engine = WeatherEngine()
