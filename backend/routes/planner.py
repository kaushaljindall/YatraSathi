from fastapi import APIRouter, Depends, HTTPException
import httpx
import logging

from auth.dependencies import get_current_user
from schemas.trip import ItineraryGenerateRequest
from config.settings import settings

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
        # TODO: Inject weather service and RAG insights
        system_prompt = "You are YatraSaathi, an elite AI travel assistant."
        user_prompt = f"Plan a trip to {request.destination} for {request.dates} on a {request.budget} budget. Interests: {', '.join(request.interests)}. Style: {request.travel_style}."
        
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
                    "temperature": 0.7
                },
                timeout=30.0
            )
            
        if response.status_code != 200:
            logger.error(f"Groq API Error: {response.text}")
            raise HTTPException(status_code=502, detail="Failed to communicate with AI service")
            
        ai_data = response.json()
        itinerary_text = ai_data["choices"][0]["message"]["content"]
        
        # In a real app, we parse this into structured JSON models
        # and save it to the database linked to the user
        
        return {
            "success": True,
            "destination": request.destination,
            "itinerary": itinerary_text,
            "estimated_cost": "Calculated by Budget Service"
        }
        
    except Exception as e:
        logger.error(f"Itinerary generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during itinerary generation")
