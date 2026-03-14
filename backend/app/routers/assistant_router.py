from fastapi import APIRouter
from app.schemas.assistant_schema import ChatRequest, ChatResponse
import uuid

router = APIRouter(prefix="/assistant", tags=["Assistant"])

@router.post("/chat", response_model=ChatResponse)
def chat_with_assistant(request: ChatRequest):
    """Interact with the AI travel assistant."""
    # Placeholder for LLM interaction logic
    session_id = request.session_id or str(uuid.uuid4())
    
    # Normally, you would call `app.ai.llm_client.chat(request.message, session_id)`
    reply = f"Hello! I am your YatraSathi assistant. You said: {request.message}"
    
    return ChatResponse(reply=reply, session_id=session_id)
