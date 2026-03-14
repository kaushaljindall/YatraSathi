from fastapi import APIRouter, Depends, HTTPException
from tinydb import TinyDB
from app.schemas.itinerary_schema import ItineraryGenerateRequest, ItineraryResponse
from app.services.itinerary_service import generate_ai_itinerary
from app.database import get_db

router = APIRouter(prefix="/itinerary", tags=["Itinerary"])

@router.post("/generate", response_model=ItineraryResponse)
def generate_itinerary(request: ItineraryGenerateRequest, db: TinyDB = Depends(get_db)):
    """Generate an optimized day-wise travel plan using an LLM combined with attraction clustering and route optimization."""
    try:
        itinerary = generate_ai_itinerary(db, request.trip_id)
        if not itinerary:
            raise HTTPException(status_code=404, detail="Could not generate itinerary for the given trip.")
        return itinerary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
