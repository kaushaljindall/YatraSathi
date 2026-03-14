from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class TripCreate(BaseModel):
    destination: str
    start_date: datetime
    end_date: datetime
    budget: float
    interests: List[str]

class TripResponse(BaseModel):
    id: int
    destination: str
    start_date: datetime
    end_date: datetime
    budget: float
    interests: List[str]
