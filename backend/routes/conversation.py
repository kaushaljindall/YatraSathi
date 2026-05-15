from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging

from auth.dependencies import get_current_user
from agentic.task_manager import task_manager
from translation.translator import translator
from translation.language_detector import language_detector
from conversation.intent_engine import intent_engine

router = APIRouter()
logger = logging.getLogger(__name__)

class ChatRequest(BaseModel):
    message: str
    preferred_language: str = "en"

class TranslateRequest(BaseModel):
    text: str
    target_language: str
    source_language: str = "auto"

class AgentTaskRequest(BaseModel):
    query: str
    preferred_language: str = "en"

@router.post("/conversation/chat")
async def chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    The primary conversational AI endpoint. Routes user messages through
    the full pipeline: intent detection → agent dispatch → multilingual response.
    """
    try:
        user_id = current_user.get("id", 0)
        result = await task_manager.handle_text_query(
            user_id=user_id,
            text=request.message,
            preferred_lang=request.preferred_language
        )
        return {"success": True, **result}
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        raise HTTPException(status_code=500, detail="Conversation pipeline failed")

@router.post("/translate/text")
async def translate_text(
    request: TranslateRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Standalone multilingual translation endpoint for menus, signs, phrases.
    """
    try:
        source = request.source_language
        if source == "auto":
            source = await language_detector.detect_language(request.text)
            
        translated = await translator.translate_text(
            request.text,
            target_lang=request.target_language,
            source_lang=source
        )
        return {
            "success": True,
            "original": request.text,
            "translated": translated,
            "detected_source_language": source
        }
    except Exception as e:
        logger.error(f"Translation failed: {e}")
        raise HTTPException(status_code=500, detail="Translation failed")

@router.post("/agent/task")
async def agent_task(
    request: AgentTaskRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Direct agent task dispatch. Ideal for structured frontend requests
    that already know which action they want (e.g., from a button).
    """
    try:
        user_id = current_user.get("id", 0)
        result = await task_manager.handle_text_query(
            user_id=user_id,
            text=request.query,
            preferred_lang=request.preferred_language
        )
        return {"success": True, **result}
    except Exception as e:
        logger.error(f"Agent task failed: {e}")
        raise HTTPException(status_code=500, detail="Agent dispatch failed")

@router.post("/intent/analyze")
async def analyze_intent(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Utility endpoint for the frontend to detect the user's intent
    before rendering dynamic UI (e.g., show budget chart vs. map).
    """
    intent = await intent_engine.analyze_intent(request.message)
    return {"success": True, "intent": intent, "message": request.message}
