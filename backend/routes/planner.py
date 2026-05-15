from fastapi import APIRouter, Depends, HTTPException
import httpx
import logging
from auth.dependencies import get_current_user
from schemas.trip import ItineraryGenerateRequest
from config.settings import settings
from ai.itinerary_ai import itinerary_ai

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/generate-trip")
async def generate_trip(
    request: ItineraryGenerateRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generates an optimized AI itinerary using Groq LLM, integrating weather and RAG insights.
    """
    try:
        # Convert preferences to list for AI
        preferences = request.interests + [request.travel_style, request.hotel_preference, request.transport_preference]
        
        # Clean budget parsing
        budget = float(request.budget) if request.budget.replace('.','',1).isdigit() else 1000.0
        
        itinerary_text = await itinerary_ai.generate(
            destination=request.destination,
            duration=len(request.dates.split(",")) if "," in request.dates else 3,
            budget=budget,
            preferences=preferences
        )
        
        return {
            "success": True,
            "destination": request.destination,
            "itinerary": itinerary_text,
            "estimated_cost": "Calculated by AI Engine"
        }
        
    except Exception as e:
        logger.error(f"Itinerary generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during itinerary generation")
