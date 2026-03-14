import random

def get_attractions(city: str):
    """
    Fetch landmarks and tourist locations for a city.
    In a real app, integrate with Google Places API or OpenTripMap.
    """
    # Mock data
    mock_attractions = {
        "Paris": [
            {"name": "Eiffel Tower", "lat": 48.8584, "lon": 2.2945},
            {"name": "Louvre Museum", "lat": 48.8606, "lon": 2.3376},
            {"name": "Notre-Dame", "lat": 48.8529, "lon": 2.3500},
            {"name": "Arc de Triomphe", "lat": 48.8738, "lon": 2.2950}
        ],
        "Tokyo": [
            {"name": "Tokyo Tower", "lat": 35.6586, "lon": 139.7454},
            {"name": "Sensō-ji", "lat": 35.7148, "lon": 139.7967},
            {"name": "Meiji Shrine", "lat": 35.6764, "lon": 139.6993}
        ]
    }
    
    return mock_attractions.get(city, [{"name": f"Main Square of {city}", "lat": 0.0, "lon": 0.0}])
