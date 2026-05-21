import os
import asyncio
from app.services.stt.whisper_service import whisper_service
from app.services.tts.edge_tts_service import edge_tts_service
from app.services.lipsync.wawa_service import wawa_service
import uuid
import json

async def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    from translation.translator import translator
    try:
        return await translator.translate_text(text, target_lang=target_lang, source_lang=source_lang)
    except Exception:
        return text

async def ensure_directories():
    """Run directory checks asynchronously to offload I/O blocking"""
    os.makedirs("data/cache", exist_ok=True)
    os.makedirs("data/temp", exist_ok=True)

async def process_audio_stream(audio_bytes: bytes, target_lang: str = "en", source_lang: str = "auto"):
    """
    Real-time streaming pipeline optimized with parallel processing (no Redis).
    """
    yield {"type": "status", "message": "Processing audio..."}
    
    # Fire off directory preparation in parallel to save time
    dir_task = asyncio.create_task(ensure_directories())

    # 1. STT (Speech to Text)
    whisper_lang = None if source_lang == "auto" else source_lang
    text, lang = await whisper_service.transcribe_audio(audio_bytes, language=whisper_lang)
    yield {"type": "stt", "text": text, "lang": lang}
    
    if not text:
        yield {"type": "error", "message": "Could not hear anything."}
        return

    # Wait for directories to be ready before proceeding to save files
    await dir_task

    # 2. Translation
    ai_response_text = await translate_text(text, lang, target_lang)
    yield {"type": "translation", "text": ai_response_text}

    # 3. TTS (Text to Speech)
    unique_id = str(uuid.uuid4())[:8]
    audio_out_path = f"data/cache/out_{unique_id}.mp3"

    await edge_tts_service.generate_audio(ai_response_text, target_lang, audio_out_path)
    
    # Stream audio immediately to the 3D frontend (use absolute URL for React iframe)
    audio_frontend_url = audio_out_path.replace("data/cache", "http://localhost:8000/static")
    
    yield {
        "type": "audio_url",
        "url": audio_frontend_url,
        "text": ai_response_text
    }

    # Native frontend lipsync takes over from here!
    # No backend video generation needed.
