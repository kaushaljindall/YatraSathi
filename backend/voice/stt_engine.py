import logging

logger = logging.getLogger(__name__)

class STTEngine:
    async def transcribe(self, audio_bytes: bytes, language: str = None) -> str:
        """
        Converts speech to text using Whisper.
        Handles travel-related commands and noisy environments.
        """
        logger.info("Transcribing audio using Whisper...")
        # Production:
        # import whisper
        # model = whisper.load_model("base")
        # result = model.transcribe(audio_file)
        
        # Mock transcription for now
        return "Can you find a budget cafe near me?"

stt_engine = STTEngine()
