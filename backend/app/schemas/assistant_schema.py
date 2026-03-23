from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    trip_id: Optional[int] = None
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    session_id: str

class TranslationRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

class TranslationResponse(BaseModel):
    translated_text: str
