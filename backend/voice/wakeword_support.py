import logging

logger = logging.getLogger(__name__)

class WakeWordEngine:
    async def detect_wakeword(self, audio_chunk: bytes) -> bool:
        """
        Detects 'Hey YatraSaathi' to trigger active listening.
        Production uses Porcupine or custom tiny ML model.
        """
        # Mock implementation
        return False

wakeword_engine = WakeWordEngine()
