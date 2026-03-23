from pydantic import BaseModel
from typing import Dict, Any, List

class ItineraryGenerateRequest(BaseModel):
    trip_id: int

class ItineraryResponse(BaseModel):
    id: int
    trip_id: int
    days_plan: List[Dict[str, Any]]

class DirectItineraryRequest(BaseModel):
    destination: str
    days: int
    budget: str
    interests: str

class DirectItineraryResponse(BaseModel):
    html_content: str
