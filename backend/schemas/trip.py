from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Union

class TripCreate(BaseModel):
    destination: str
    budget: float
    duration: int
    preferences: Optional[Dict[str, Any]] = None

class TripResponse(BaseModel):
    trip_id: int
    destination: str
    budget: float
    duration: int
    preferences: Dict[str, Any]

    class Config:
        from_attributes = True

class ItineraryGenerateRequest(BaseModel):
    destination: str
    dates: str
    budget: Union[str, float]
    interests: List[str]
    travel_style: str
    hotel_preference: str
    transport_preference: str

class CityInsightRequest(BaseModel):
    city: str
    query: str
