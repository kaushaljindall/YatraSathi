from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime, date
import logging

from auth.dependencies import get_current_user
from config.database import read_db, write_db
from budget.budget_engine import budget_engine

router = APIRouter()
logger = logging.getLogger(__name__)


class BudgetAnalysisRequest(BaseModel):
    trip_id: int
    budget: float
    expenses: list[dict]  # [{category, amount, timestamp}, ...]


@router.post("/analyze")
async def analyze_budget(
    request: BudgetAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    AI-driven budget analysis: detects overspending, calculates burn rate,
    and generates contextual financial recommendations.
    """
    try:
        db_data = await read_db()

        # Fetch the actual trip to get destination and real dates
        trip = next(
            (t for t in db_data["trips"]
             if t["trip_id"] == request.trip_id
             and t["user_id"] == current_user["id"]),
            None
        )
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")

        destination = trip.get("destination", "unknown")
        duration = trip.get("duration_days", 3)

        # Calculate real current_day from trip start date
        try:
            start = datetime.fromisoformat(trip["start_date"]).date()
            current_day = max(1, (date.today() - start).days + 1)
            current_day = min(current_day, duration)  # Cap at trip length
        except Exception:
            current_day = 1

        summary = await budget_engine.get_budget_summary(
            city=destination,
            total_budget=request.budget,
            duration=duration,
            current_day=current_day,
            expenses=request.expenses
        )

        return {
            "success": True,
            "trip_id": request.trip_id,
            "destination": destination,
            "current_day": current_day,
            "duration_days": duration,
            "data": summary
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Budget analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
