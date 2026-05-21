import os
import asyncio
from app.services.stt.whisper_service import whisper_service
from app.services.tts.edge_tts_service import edge_tts_service
from app.services.lipsync.wawa_service import wawa_service
from app.services.streaming.audio2face_service import audio2face_service
from ai.llm_service import llm_service
import uuid
import json

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

    # 2. LLM via Groq (Pure Translation Mode)
    yield {"type": "status", "message": "Translating..."}
    lang_map = {"en": "English", "hi": "Hindi", "es": "Spanish", "fr": "French", "ja": "Japanese", "de": "German"}
    full_lang = lang_map.get(target_lang, target_lang)
    
    system_prompt = f"You are a highly accurate professional translator. Translate the following text into {full_lang}. Reply ONLY with the exact translated text in {full_lang}, with no conversational filler, no quotation marks, and no extra explanation."
    ai_response_text = await llm_service.generate_response(system_prompt, text, key_type="translation")
    yield {"type": "translation", "text": ai_response_text}
    
    # Simple heuristic emotion detection for A2F
    emotion_params = {"joy": 0.0, "anger": 0.0, "sadness": 0.0}
    lower_text = ai_response_text.lower()
    if any(w in lower_text for w in ["happy", "great", "excellent", "fun"]):
        emotion_params["joy"] = 0.8
    elif any(w in lower_text for w in ["sorry", "sad", "apologize"]):
        emotion_params["sadness"] = 0.6

    # 3. TTS (Text to Speech)
    unique_id = str(uuid.uuid4())[:8]
    audio_out_path = f"data/cache/out_{unique_id}.mp3"

    await edge_tts_service.generate_audio(ai_response_text, target_lang, audio_out_path)
    
    # Stream audio immediately to the 3D frontend
    audio_frontend_url = f"http://localhost:8000/api/v1/voice/audio/{unique_id}"
    
    yield {"type": "status", "message": "Generating facial animation..."}
    
    # 4. Audio2Face Inference
    a2f_frames = await audio2face_service.generate_blendshapes(audio_out_path, emotion_params=emotion_params)
    
    yield {
        "type": "a2f_stream",
        "audio_id": unique_id,
        "url": audio_frontend_url,
        "text": ai_response_text,
        "frames": a2f_frames
    }

    # Native frontend lipsync takes over from here!
