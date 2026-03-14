from fastapi import APIRouter, Query
from app.services.hotel_service import get_hotel_recommendations
from app.services.attraction_service import get_attractions
from typing import List, Dict, Any

router = APIRouter(tags=["Discover"])

@router.get("/hotels/search")
def search_hotels(city: str, budget: float = Query(None)):
    """Return recommended hotels based on location and budget."""
    hotels = get_hotel_recommendations(city, budget)
    return {"city": city, "hotels": hotels}

@router.get("/attractions/{city}")
def fetch_attractions(city: str):
    """Fetch tourist attractions and landmarks for a given city."""
    attractions = get_attractions(city)
    return {"city": city, "attractions": attractions}
