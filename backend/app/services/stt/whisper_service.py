import asyncio
import io
try:
    import whisper
    import torch
except ImportError:
    whisper = None
    torch = None

class WhisperService:
    def __init__(self):
        self.device = "cuda" if torch and torch.cuda.is_available() else "cpu"
        self.model = None
        self._load_model()

    def _load_model(self):
        if not whisper:
            return
        # Load medium model as requested, optimizing with fp16 if on GPU
        self.model = whisper.load_model("medium", device=self.device)
        if self.device == "cuda":
            self.model = self.model.half()

    async def transcribe_audio(self, audio_bytes: bytes, language: str = None) -> tuple[str, str]:
        """
        Transcribe audio bytes using Whisper asynchronously to avoid blocking the event loop.
        """
        if not self.model:
            return "Whisper model not loaded. Please ensure dependencies are installed.", "en"

        # Typically, we need to save bytes to a temporary file or load it into memory via soundfile/librosa
        # For simplicity, we assume audio_bytes are saved to a temporary WAV file and processed.
        temp_file = "temp_audio.wav"
        with open(temp_file, "wb") as f:
            f.write(audio_bytes)

        loop = asyncio.get_event_loop()
        
        # GPU Optimization: Execution is wrapped in executor for concurrency
        result = await loop.run_in_executor(
            None,
            lambda: self.model.transcribe(
                temp_file,
                language=language,
                fp16=(self.device == "cuda")
            )
        )
        
        detected_lang = result.get("language", "en")
        text = result.get("text", "").strip()
        
        return text, detected_lang

whisper_service = WhisperService()
