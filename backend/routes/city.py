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

LIVE_INFO_CACHE = {}

@router.get("/live-info")
async def get_live_city_info(city: str = Query(...)):
    """
    Scrapes real-time weather and average daily spend for a given city.
    Uses wttr.in for weather and BeautifulSoup to parse search results for spend.
    Results are cached in-memory for performance.
    """
    import httpx
    from bs4 import BeautifulSoup
    import re
    import time

    city_key = city.lower().strip()
    
    # Simple in-memory cache (expires after 1 hour)
    if city_key in LIVE_INFO_CACHE:
        cached_data, timestamp = LIVE_INFO_CACHE[city_key]
        if time.time() - timestamp < 3600:
            return cached_data

    weather = "25°C, Clear"
    spend = "₹5,000 / day"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # 1. Get Weather
            try:
                w_res = await client.get(f"https://wttr.in/{city}?format=%t,+%C")
                if w_res.status_code == 200 and "<html" not in w_res.text and "Unknown" not in w_res.text:
                    weather = w_res.text.strip()
            except Exception as we:
                logger.error(f"Weather fetch failed: {we}")

            # 2. Scrape Average Spend using DuckDuckGo
            try:
                headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
                s_res = await client.get(f"https://html.duckduckgo.com/html/?q=average+daily+travel+cost+in+{city}", headers=headers)
                if s_res.status_code == 200:
                    soup = BeautifulSoup(s_res.text, 'html.parser')
                    snippet = soup.find('a', class_='result__snippet')
                    if snippet:
                        text = snippet.text
                        # Find currency pattern like $50, ₹4000, 50 USD
                        match = re.search(r'(\$|₹|€|£)?\s*\d+(?:,\d{3})*(?:\.\d+)?', text)
                        if match:
                            spend = f"{match.group(0)} / day"
            except Exception as se:
                logger.error(f"Spend scrape failed: {se}")

        response_data = {"success": True, "weather": weather, "average_spend": spend}
        LIVE_INFO_CACHE[city_key] = (response_data, time.time())
        return response_data
    except Exception as e:
        logger.error(f"Live info failed: {e}")
        return {"success": False, "weather": weather, "average_spend": spend}

