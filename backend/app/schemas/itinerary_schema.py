from pydantic import BaseModel
from typing import Dict, Any, List

class ItineraryGenerateRequest(BaseModel):
    trip_id: int

class ItineraryResponse(BaseModel):
    id: int
    trip_id: int
    days_plan: List[Dict[str, Any]]
