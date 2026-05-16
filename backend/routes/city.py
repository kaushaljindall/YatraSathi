from fastapi import APIRouter, Depends, HTTPException
import logging

from auth.dependencies import get_current_user
from schemas.trip import CityInsightRequest
from ai.recommendation_engine import recommendation_engine

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/city-insights")
async def get_city_insights(
    request: CityInsightRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    RAG-powered city insights. Retrieves local data using FAISS and grounds
    the LLM response with real contextual city knowledge.
    """
    try:
        user_id = current_user.get("id", 0)
        result = await recommendation_engine.get_recommendation(
            user_id=user_id,
            query=request.query,
            city=request.city
        )

        import json
        try:
            insights_data = json.loads(result["recommendation"])
        except Exception:
            insights_data = {"error": "Failed to parse insights", "raw": result["recommendation"]}

        return {
            "success": True,
            "city": result["city"],
            "insights": insights_data,
            "sources_used": result["sources_used"]
        }

    except Exception as e:
        logger.error(f"City insights failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
