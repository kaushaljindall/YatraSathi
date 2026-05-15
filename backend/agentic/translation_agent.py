import logging
from translation.translator import translator

logger = logging.getLogger(__name__)

class TranslationAgent:
    async def execute(self, state: dict) -> str:
        """
        Handles all in-trip translation needs: menus, signs, conversations.
        Detects target language from context and translates on demand.
        """
        query = state["query"]
        context = state["context"]
        
        # Extract what to translate from the query
        # E.g., "translate 'Dhanyawad' to English"
        text_to_translate = query.replace("translate", "").strip().strip("'\"")
        
        translated = await translator.translate_text(text_to_translate, target_lang="en")
        
        return f"Translation: {translated}"

translation_agent = TranslationAgent()
