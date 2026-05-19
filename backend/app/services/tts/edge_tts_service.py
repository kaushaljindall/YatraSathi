import os
import asyncio
try:
    import edge_tts
except ImportError:
    edge_tts = None
from app.core.cache import generate_cache_key, get_cache, set_cache

class EdgeTTSService:
    def __init__(self):
        # Multilingual support mappings
        self.voice_map = {
            "en": "en-US-AriaNeural",
            "hi": "hi-IN-SwaraNeural",
            "fr": "fr-FR-DeniseNeural",
            "es": "es-ES-ElviraNeural",
            "ja": "ja-JP-NanamiNeural",
            "de": "de-DE-KatjaNeural",
            "ar": "ar-SA-ZariyahNeural",
            "pa": "pa-IN-OjasNeural" # Punjabi fallback if available in edge_tts, else default
        }

    async def generate_audio(self, text: str, lang: str, output_path: str) -> str:
        """
        Generates TTS audio and caches the resulting file path based on text and voice.
        """
        if not edge_tts:
            raise Exception("edge-tts is not installed.")

        voice = self.voice_map.get(lang, "en-US-AriaNeural")
        cache_key = await generate_cache_key("tts", text=text, voice=voice)

        cached_path = await get_cache(cache_key)
        if cached_path and os.path.exists(cached_path):
            return cached_path

        # Generate audio
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_path)
        
        # Cache for future use
        await set_cache(cache_key, output_path, ttl=86400)
        return output_path

edge_tts_service = EdgeTTSService()
