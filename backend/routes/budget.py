from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import httpx
import logging

from auth.dependencies import get_current_user
from config.settings import settings

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
        system_prompt = "You are an expert financial travel advisor. Analyze the given budget constraints and current expenses for the destination. Provide warnings for overspending and smart money-saving tips."
        user_prompt = f"Destination: {request.destination}\nTotal Budget: ${request.budget}\nDuration: {request.duration} days\nCurrent Expenses: {request.expenses}\n\nAnalyze and warn."
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
                json={
                    "model": "llama3-8b-8192",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.4
                },
                timeout=20.0
            )
            
        if response.status_code != 200:
            raise HTTPException(status_code=502, detail="AI Service unavailable")
            
        analysis = response.json()["choices"][0]["message"]["content"]
        
        return {
            "success": True,
            "analysis": analysis
        }
    except Exception as e:
        logger.error(f"Budget analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
