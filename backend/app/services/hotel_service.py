def get_hotel_recommendations(city: str, budget: float = None):
    """
    Suggest accommodations based on location and budget.
    Would integrate with Expedia or Booking APIs.
    """
    # Mock data
    return [
        {"name": f"Grand {city} Hotel", "price_per_night": 150, "rating": 4.5},
        {"name": f"Cozy Stay {city}", "price_per_night": 60, "rating": 4.0},
        {"name": f"{city} Backpackers Hostel", "price_per_night": 25, "rating": 3.8}
    ]
