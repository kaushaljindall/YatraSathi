from fastapi import APIRouter, Depends, HTTPException
import httpx
import logging

from auth.dependencies import get_current_user
from schemas.trip import CityInsightRequest
from config.settings import settings
from rag.vector_store import rag_system

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/city-insights")
async def get_city_insights(
    request: CityInsightRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    RAG-powered city insights. Retrieves local data using FAISS and grounds the LLM response.
    """
    try:
        # 1. Retrieve context from FAISS
        context_chunks = rag_system.retrieve(f"{request.city} {request.query}")
        context_text = "\n".join(context_chunks) if context_chunks else "No specific local data available. Rely on general knowledge."
        
        # 2. Build grounded prompt
        system_prompt = f"You are a local expert guide for {request.city}. Use the following context to answer the user's query. If the context doesn't have the answer, use your general knowledge but mention it's not verified local data.\n\nContext:\n{context_text}"
        
        # 3. Call LLM
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
                json={
                    "model": "llama3-8b-8192",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": request.query}
                    ],
                    "temperature": 0.5
                },
                timeout=20.0
            )
            
        if response.status_code != 200:
            raise HTTPException(status_code=502, detail="AI Service unavailable")
            
        ai_response = response.json()["choices"][0]["message"]["content"]
        
        return {
            "success": True,
            "city": request.city,
            "insights": ai_response,
            "sources_used": len(context_chunks)
        }
        
    except Exception as e:
        logger.error(f"City insights failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
