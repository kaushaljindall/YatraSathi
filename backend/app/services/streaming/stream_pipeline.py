import os
import asyncio
import hashlib
from app.services.stt.whisper_service import whisper_service
from app.services.tts.edge_tts_service import edge_tts_service
from app.services.lipsync.wawa_service import wawa_service
from redis_cache.redis_client import redis_client
import uuid
import json

async def generate_ai_response(text: str, context: dict) -> str:
    """Mock AI generation - replace with actual LLM integration (e.g. Gemini/OpenAI)"""
    return f"Translated from {context.get('source_lang')}: {text}"

async def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    from translation.translator import translator
    try:
        return await translator.translate_text(text, target_lang=target_lang, source_lang=source_lang)
    except Exception:
        # Fallback if no translation module
        return text

async def process_audio_stream(audio_bytes: bytes, target_lang: str = "en"):
    """
    Real-time streaming pipeline with Redis caching.
    """
    yield {"type": "status", "message": "Processing audio..."}
    
    # 1. STT (Speech to Text)
    text, lang = await whisper_service.transcribe_audio(audio_bytes)
    yield {"type": "stt", "text": text, "lang": lang}
    
    if not text:
        yield {"type": "error", "message": "Could not hear anything."}
        return

    # Cache key for translation
    trans_cache_key = f"trans_{lang}_{target_lang}_{hashlib.md5(text.encode()).hexdigest()}"
    await redis_client.connect()
    
    cached_translation = await redis_client.cache_get(trans_cache_key)
    
    if cached_translation:
        ai_response_text = cached_translation
    else:
        # 2. Translation
        ai_response_text = await translate_text(text, lang, target_lang)
        await redis_client.cache_set(trans_cache_key, ai_response_text, ttl=86400)

    yield {"type": "translation", "text": ai_response_text}

    # Ensure directories exist so services don't crash
    os.makedirs("app/static/audio", exist_ok=True)
    os.makedirs("app/static/videos", exist_ok=True)
    os.makedirs("app/static/avatars", exist_ok=True)

    # Cache key for TTS
    tts_cache_key = f"tts_{target_lang}_{hashlib.md5(ai_response_text.encode()).hexdigest()}"
    cached_audio_url = await redis_client.cache_get(tts_cache_key)

    unique_id = str(uuid.uuid4())[:8]
    audio_out_path = f"app/static/audio/out_{unique_id}.mp3"

    if cached_audio_url:
        audio_frontend_url = cached_audio_url
        if audio_frontend_url.startswith("/"):
            audio_out_path = "app" + audio_frontend_url
    else:
        # 3. TTS (Text to Speech)
        await edge_tts_service.generate_audio(ai_response_text, target_lang, audio_out_path)
        
        # Stream audio immediately to the 3D frontend
        audio_frontend_url = audio_out_path.replace("app/", "/")
        await redis_client.cache_set(tts_cache_key, audio_frontend_url, ttl=86400)
    
    yield {
        "type": "audio_url",
        "url": audio_frontend_url,
        "text": ai_response_text
    }

    # 4. LipSync Avatar Generation
    video_out_path = f"app/static/videos/out_{unique_id}.mp4"
    avatar_base_path = "app/static/avatars/base_avatar.mp4"
    
    # Run wawa-lipsync for users wanting video playback instead of 3D, if configured
    if os.path.exists(avatar_base_path):
        video_path = await wawa_service.generate_lipsync(
            audio_path=audio_out_path,
            avatar_video_path=avatar_base_path,
            output_path=video_out_path
        )
        yield {
            "type": "video_ready",
            "url": video_path.replace("app/", "/"),
            "text": ai_response_text
        }
