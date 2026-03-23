from fastapi import APIRouter
from app.schemas.assistant_schema import ChatRequest, ChatResponse, TranslationRequest, TranslationResponse
from app.ai.llm_client import LLMClient
import uuid

router = APIRouter(prefix="/assistant", tags=["Assistant"])
llm_client = LLMClient()

@router.post("/chat", response_model=ChatResponse)
def chat_with_assistant(request: ChatRequest):
    """Interact with the AI travel assistant."""
    session_id = request.session_id or str(uuid.uuid4())
    
    # Use real LLM client for chat logic
    reply = llm_client.chat(request.message, session_id)
    
    return ChatResponse(reply=reply, session_id=session_id)

@router.post("/translate", response_model=TranslationResponse)
def translate_text(request: TranslationRequest):
    """Real-time translation using LLM."""
    prompt = f"Translate the following text from {request.source_lang} to {request.target_lang}. Reply ONLY with the translated text, absolutely nothing else. Text: '{request.text}'"
    translated = llm_client.generate(prompt)
    return TranslationResponse(translated_text=translated.strip())
