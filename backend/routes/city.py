from fastapi import APIRouter, Depends, HTTPException, Query
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
        from ai.image_scraper import get_image_for_query
        import asyncio
        try:
            insights_data = json.loads(result["recommendation"])
            
            # Fetch real images for attractions concurrently
            attractions = insights_data.get("attractions", [])
            if attractions:
                tasks = [get_image_for_query(f"{a['name']} {result['city']}") for a in attractions]
                image_urls = await asyncio.gather(*tasks)
                for idx, a in enumerate(attractions):
                    a["img"] = image_urls[idx]
                    
        except Exception as e:
            logger.error(f"Error parsing/fetching images: {e}")
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


@router.get("/city-image")
async def get_city_image(
    city: str = Query(..., description="City name to fetch image for")
):
    """
    Lightweight endpoint: scrapes a high-quality city image via Wikipedia
    and returns the URL. No auth required — used by the home page trip cards.
    """
    from ai.image_scraper import get_image_for_query
    try:
        url = await get_image_for_query(city)
        return {"success": True, "city": city, "image_url": url}
    except Exception as e:
        logger.error(f"City image fetch failed for '{city}': {e}")
        return {
            "success": False,
            "city": city,
            "image_url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop"
        }

