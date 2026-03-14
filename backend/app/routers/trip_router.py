from fastapi import APIRouter, Depends, HTTPException
from tinydb import TinyDB, Query
from app.schemas.trip_schema import TripCreate, TripResponse
from app.database import get_db

router = APIRouter(prefix="/trip", tags=["Trip"])

@router.post("/create", response_model=TripResponse)
def create_trip(trip: TripCreate, db: TinyDB = Depends(get_db)):
    """Create a new trip with destination, dates, budget, and interests."""
    trips_table = db.table('trips')
    
    trip_data = {
        "destination": trip.destination,
        "start_date": trip.start_date.isoformat(),
        "end_date": trip.end_date.isoformat(),
        "budget": trip.budget,
        "interests": trip.interests
    }
    
    # Insert returns the newly created document ID
    doc_id = trips_table.insert(trip_data)
    
    trip_data["id"] = doc_id
    # Ensure datetime strings are parsed correctly by Pydantic by returning dict
    return trip_data

@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: int, db: TinyDB = Depends(get_db)):
    """Retrieve trip details by trip ID."""
    trips_table = db.table('trips')
    trip = trips_table.get(doc_id=trip_id)
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    trip_dict = dict(trip)
    trip_dict["id"] = trip.doc_id
    return trip_dict
