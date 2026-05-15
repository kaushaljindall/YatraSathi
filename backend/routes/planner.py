from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime
import time
import logging

from auth.dependencies import get_current_user
from schemas.trip import ItineraryGenerateRequest
from config.database import read_db, write_db
from ai.itinerary_ai import itinerary_ai

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/generate-trip")
async def generate_trip(
    request: ItineraryGenerateRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generates an AI itinerary using Groq LLM grounded with RAG city context,
    then persists the result to the database.
    """
    try:
        preferences = (
            request.interests
            + [request.travel_style, request.hotel_preference, request.transport_preference]
        )

        # Parse budget
        try:
            budget = float(request.budget)
        except (ValueError, AttributeError):
            budget = 1000.0

        # Calculate duration from dates
        try:
            date_list = [d.strip() for d in request.dates.split(",") if d.strip()]
            duration = len(date_list) if len(date_list) > 1 else 3
        except Exception:
            duration = 3

        # Generate itinerary via LLM + RAG
        itinerary_text = await itinerary_ai.generate(
            destination=request.destination,
            duration=duration,
            budget=budget,
            preferences=preferences
        )

        # Estimate cost: simple heuristic (budget × 0.85 as realistic spend)
        estimated_cost = round(budget * 0.85, 2)

        # Persist to DB if trip_id is provided
        db_data = await read_db()
        itinerary_record = None

        if hasattr(request, "trip_id") and request.trip_id:
            itinerary_record = {
                "itinerary_id": int(time.time() * 1000),
                "trip_id": request.trip_id,
                "user_id": current_user["id"],
                "destination": request.destination,
                "duration_days": duration,
                "itinerary_text": itinerary_text,
                "estimated_cost": estimated_cost,
                "generated_at": datetime.utcnow().isoformat()
            }
            # Replace existing itinerary for this trip
            db_data["itineraries"] = [
                i for i in db_data["itineraries"]
                if i.get("trip_id") != request.trip_id
            ]
            db_data["itineraries"].append(itinerary_record)
            await write_db(db_data)

        return {
            "success": True,
            "destination": request.destination,
            "duration_days": duration,
            "itinerary": itinerary_text,
            "estimated_cost": estimated_cost,
            "itinerary_id": itinerary_record["itinerary_id"] if itinerary_record else None
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Itinerary generation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error during itinerary generation"
        )
