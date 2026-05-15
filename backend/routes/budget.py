from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import httpx
import logging

from auth.dependencies import get_current_user
from config.settings import settings
from budget.budget_engine import budget_engine

router = APIRouter()
logger = logging.getLogger(__name__)

class BudgetAnalysisRequest(BaseModel):
    destination: str
    budget: float
    duration: int
    expenses: list[dict] # e.g. [{"category": "hotel", "amount": 200}]

@router.post("/analyze")
async def analyze_budget(
    request: BudgetAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    AI-driven budget analysis to detect overspending and suggest optimizations.
    """
    try:
        # Run through the master budget orchestrator
        summary = await budget_engine.get_budget_summary(
            city=request.destination,
            total_budget=request.budget,
            duration=request.duration,
            current_day=1, # Mocking current day, normally calculated from trip dates
            expenses=request.expenses
        )
        
        return {
            "success": True,
            "data": summary
        }
    except Exception as e:
        logger.error(f"Budget analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
