import logging

logger = logging.getLogger(__name__)

class LanguageDetector:
    async def detect_language(self, text: str) -> str:
        """
        Detects the primary language of the user input or foreign text.
        Returns ISO 639-1 language code (e.g., 'en', 'es', 'fr', 'hi', 'ja').
        In production, calls Google Cloud Translation API or fasttext.
        """
        # Mock simple heuristic for demonstration. Production uses an ML model.
        text_lower = text.lower()
        if any(char in text_lower for char in "こんにちはありがとう"):
            return "ja"
        elif any(char in text_lower for char in "नमस्तेधन्यवाद"):
            return "hi"
        elif "gracias" in text_lower or "hola" in text_lower:
            return "es"
        elif "bonjour" in text_lower or "merci" in text_lower:
            return "fr"
            
        return "en"

language_detector = LanguageDetector()
