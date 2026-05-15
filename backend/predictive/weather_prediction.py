import logging

logger = logging.getLogger(__name__)

class WeatherPredictor:
    """Provides short-range weather risk assessments. Production: calls OpenWeatherMap Forecast API."""

    async def forecast_risk(self, city: str, days_ahead: int = 1) -> dict:
        # Mock forecast — production pulls 5-day OpenWeatherMap data
        mock_forecast = {
            "rain_probability": 0.35,
            "storm_risk": False,
            "heatwave_risk": False,
            "travel_disruption_risk": "low",
        }
        
        advice = "Weather looks clear. Outdoor activities are safe."
        if mock_forecast["rain_probability"] > 0.6:
            advice = "High rain chance. Prioritize indoor activities or carry an umbrella."
        elif mock_forecast["rain_probability"] > 0.35:
            advice = "Moderate rain risk. Consider morning outdoor activities and indoor afternoons."

        return {
            "city": city,
            "days_ahead": days_ahead,
            **mock_forecast,
            "advice": advice,
        }

weather_predictor = WeatherPredictor()
