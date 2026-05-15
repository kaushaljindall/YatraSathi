from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import Response
from pydantic import BaseModel
import logging

from auth.dependencies import get_current_user
from voice.stt_engine import stt_engine
from voice.tts_engine import tts_engine
from voice.audio_processing import audio_processor
from agentic.task_manager import task_manager

router = APIRouter()
logger = logging.getLogger(__name__)

class VoiceRespondRequest(BaseModel):
    text: str
    language: str = "en"

@router.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Accepts an audio file upload and returns the transcribed text using Whisper STT.
    """
    try:
        audio_bytes = await audio.read()
        processed_audio = await audio_processor.process_audio_stream(audio_bytes)
        transcript = await stt_engine.transcribe(processed_audio)
        return {"success": True, "transcript": transcript}
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        raise HTTPException(status_code=500, detail="Transcription failed")

@router.post("/respond")
async def voice_respond(
    request: VoiceRespondRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Accepts text and returns an audio response using Edge-TTS.
    Designed for voice-UI use cases on the frontend.
    """
    try:
        audio_bytes = await tts_engine.generate_speech(request.text, request.language)
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception as e:
        logger.error(f"TTS failed: {e}")
        raise HTTPException(status_code=500, detail="Speech generation failed")
