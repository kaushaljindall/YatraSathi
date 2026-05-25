import os
import asyncio
try:
    import edge_tts
except ImportError:
    edge_tts = None

try:
    from gtts import gTTS
except ImportError:
    gTTS = None

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
            "pa": "pa-IN-OjasNeural" 
        }

    def _gtts_fallback(self, text: str, lang: str, output_path: str):
        if not gTTS:
            raise Exception("Neither edge-tts nor gTTS is available.")
        gtts_lang = lang.split('-')[0] if '-' in lang else lang
        if gtts_lang == "auto": gtts_lang = "en"
        try:
            tts = gTTS(text=text, lang=gtts_lang)
            tts.save(output_path)
        except Exception:
            tts = gTTS(text=text, lang='en')
            tts.save(output_path)

    async def generate_audio(self, text: str, lang: str, output_path: str) -> str:
        voice = self.voice_map.get(lang, "en-US-AriaNeural")
        cache_key = await generate_cache_key("tts", text=text, voice=voice)

        cached_path = await get_cache(cache_key)
        if cached_path and os.path.exists(cached_path):
            return cached_path

        try:
            if not edge_tts:
                raise Exception("edge-tts not installed")
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(output_path)
        except Exception as e:
            print(f"⚠️ edge-tts failed ({e}), falling back to gTTS...")
            await asyncio.to_thread(self._gtts_fallback, text, lang, output_path)
        
        await set_cache(cache_key, output_path, ttl=86400)
        return output_path

edge_tts_service = EdgeTTSService()
