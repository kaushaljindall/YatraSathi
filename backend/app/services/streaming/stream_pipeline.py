import asyncio
from app.services.stt.whisper_service import whisper_service
from app.services.tts.edge_tts_service import edge_tts_service
from app.services.lipsync.wawa_service import wawa_service
import uuid

async def generate_ai_response(text: str, context: dict) -> str:
    """Mock AI generation - replace with actual LLM integration (e.g. Gemini/OpenAI)"""
    await asyncio.sleep(0.5)
    return f"This is Ziva's response to your query about: {text}. Have a great trip!"

async def process_audio_stream(audio_bytes: bytes):
    """
    Real-time streaming pipeline. Yields dictionaries representing websocket events.
    """
    yield {"type": "status", "payload": "Processing audio..."}
    
    # 1. STT (Speech to Text)
    text, lang = await whisper_service.transcribe_audio(audio_bytes)
    yield {"type": "stt", "payload": {"text": text, "lang": lang}}
    
    if not text:
        yield {"type": "error", "payload": "Could not hear anything."}
        return

    # 2. Translation & AI Response Generation
    ai_response_text = await generate_ai_response(text, {"lang": lang})
    yield {"type": "translation", "payload": ai_response_text}

    # 3. TTS (Text to Speech)
    unique_id = str(uuid.uuid4())[:8]
    audio_out_path = f"app/static/audio/out_{unique_id}.mp3"
    await edge_tts_service.generate_audio(ai_response_text, lang, audio_out_path)
    
    # Stream audio immediately to the 3D frontend
    audio_frontend_url = audio_out_path.replace("app/", "/")
    yield {
        "type": "video_ready", # Using the same event type expected by frontend
        "payload": {
            "url": audio_frontend_url,
            "text": ai_response_text
        }
    }

    # 4. (Optional) LipSync Avatar Generation
    # Since the frontend now renders a 3D GLB model via Three.js, we can optionally bypass wawa-lipsync 
    # to save latency. If you still want the mp4 generated for other clients, it can run asynchronously here.
    # video_out_path = f"app/static/videos/out_{unique_id}.mp4"
    # avatar_base_path = "app/static/avatars/base_avatar.mp4"
    # await wawa_service.generate_lipsync(
    #    audio_path=audio_out_path,
    #    avatar_video_path=avatar_base_path,
    #    output_path=video_out_path
    # )

