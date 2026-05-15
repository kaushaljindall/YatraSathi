import logging
from translation.language_detector import language_detector
from translation.translator import translator

logger = logging.getLogger(__name__)

class MultilingualResponseManager:
    async def format_response(self, text: str, user_language: str) -> str:
        """
        Ensures the AI responds in the user's preferred or detected language.
        """
        if user_language == "en" or not user_language:
            return text
            
        translated_text = await translator.translate_text(text, target_lang=user_language, source_lang="en")
        return translated_text

multilingual_responses = MultilingualResponseManager()
