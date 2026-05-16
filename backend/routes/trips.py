from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional, List
import time
import logging

from auth.dependencies import get_current_user
from config.database import read_db, write_db
from ai.itinerary_ai import itinerary_ai

router = APIRouter()
logger = logging.getLogger(__name__)


class TripCreate(BaseModel):
    destination: str
    start_date: str          # ISO format: YYYY-MM-DD
    end_date: str
    budget: float
    interests: List[str] = []
    travel_style: str = "balanced"
    hotel_preference: str = "mid-range"
    transport_preference: str = "public"
    itinerary_text: Optional[str] = None


@router.post("/create")
async def create_trip(
    trip: TripCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new trip record in the database."""
    try:
        start = datetime.strptime(trip.start_date, "%Y-%m-%d").date()
        end = datetime.strptime(trip.end_date, "%Y-%m-%d").date()
        if end <= start:
            raise HTTPException(status_code=400, detail="end_date must be after start_date")

        duration_days = (end - start).days

        db_data = await read_db()
        trip_id = int(time.time() * 1000)  # ms timestamp for uniqueness

        new_trip = {
            "trip_id": trip_id,
            "user_id": current_user["id"],
            "destination": trip.destination,
            "start_date": trip.start_date,
            "end_date": trip.end_date,
            "duration_days": duration_days,
            "budget": trip.budget,
            "interests": trip.interests,
            "travel_style": trip.travel_style,
            "hotel_preference": trip.hotel_preference,
            "transport_preference": trip.transport_preference,
            "status": "planned",
            "created_at": datetime.utcnow().isoformat()
        }

        db_data["trips"].append(new_trip)
        
        if trip.itinerary_text:
            itinerary_record = {
                "itinerary_id": trip_id + 1,
                "trip_id": trip_id,
                "user_id": current_user["id"],
                "destination": trip.destination,
                "duration_days": duration_days,
                "itinerary_text": trip.itinerary_text,
                "estimated_cost": round(trip.budget * 0.85, 2),
                "generated_at": datetime.utcnow().isoformat()
            }
            db_data["itineraries"].append(itinerary_record)

        await write_db(db_data)

        return {"success": True, "trip_id": trip_id, "trip": new_trip}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Trip creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/my-trips")
async def list_my_trips(current_user: dict = Depends(get_current_user)):
    """Return all trips belonging to the authenticated user."""
    db_data = await read_db()
    user_trips = [t for t in db_data["trips"] if t["user_id"] == current_user["id"]]
    # Sort newest first
    user_trips.sort(key=lambda t: t.get("created_at", ""), reverse=True)
    return {"success": True, "trips": user_trips, "count": len(user_trips)}


@router.get("/{trip_id}")
async def get_trip(
    trip_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Fetch a single trip with its saved itinerary."""
    db_data = await read_db()

    trip = next(
        (t for t in db_data["trips"]
         if t["trip_id"] == trip_id and t["user_id"] == current_user["id"]),
        None
    )
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # Attach itinerary if it exists
    itinerary = next(
        (i for i in db_data["itineraries"] if i["trip_id"] == trip_id),
        None
    )
    trip["itinerary"] = itinerary

    # Attach expenses
    expenses = [e for e in db_data["expenses"] if e["trip_id"] == trip_id]
    trip["expenses"] = expenses
    trip["total_spent"] = sum(e["amount"] for e in expenses)

    return {"success": True, "trip": trip}


@router.delete("/{trip_id}")
async def delete_trip(
    trip_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Delete a trip and all its associated data."""
    db_data = await read_db()

    trip = next(
        (t for t in db_data["trips"]
         if t["trip_id"] == trip_id and t["user_id"] == current_user["id"]),
        None
    )
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    db_data["trips"] = [t for t in db_data["trips"] if t["trip_id"] != trip_id]
    db_data["expenses"] = [e for e in db_data["expenses"] if e["trip_id"] != trip_id]
    db_data["itineraries"] = [i for i in db_data["itineraries"] if i["trip_id"] != trip_id]

    await write_db(db_data)
    return {"success": True, "message": f"Trip {trip_id} deleted"}
