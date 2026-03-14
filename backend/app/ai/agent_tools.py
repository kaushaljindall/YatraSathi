# Define the tool interface for LLM agent

from app.services.attraction_service import get_attractions
from app.services.weather_service import get_weather_forecast
from app.services.hotel_service import get_hotel_recommendations
from app.services.route_optimizer import optimize_route

class AgentTools:
    """Agent Tool Layer that allows the LLM to call functions."""
    
    @staticmethod
    def get_landmarks(city: str):
        """Fetch landmarks for a city."""
        return get_attractions(city)

    @staticmethod
    def get_weather(city: str, date: str):
        """Fetch weather forecasts."""
        return get_weather_forecast(city, date)

    @staticmethod
    def find_hotels(city: str, budget: float = None):
        """Find accommodations based on location and budget."""
        return get_hotel_recommendations(city, budget)

    @staticmethod
    def optimize_travel_route(attractions: list):
        """Calculate efficient paths between attractions."""
        return optimize_route(attractions)

    @classmethod
    def get_all_tools(cls):
        """Get all available tools as a dictionary for LLM tool calling."""
        return {
            "get_landmarks": cls.get_landmarks,
            "get_weather": cls.get_weather,
            "find_hotels": cls.find_hotels,
            "optimize_travel_route": cls.optimize_travel_route
        }
