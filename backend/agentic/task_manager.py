import logging
from typing import Optional, Dict, Any
from agentic.orchestration import agent_orchestrator
from conversation.dialogue_manager import dialogue_manager
from conversation.memory_engine import memory_engine
from translation.language_detector import language_detector
from translation.multilingual_responses import multilingual_responses

logger = logging.getLogger(__name__)

class TaskManager:
    """
    The single entry point for all user interactions (text or voice).
    Orchestrates the full pipeline: intent → context → agent → memory → multilingual response.
    """
    async def handle_text_query(self, user_id: int, text: str, preferred_lang: str = "en") -> Dict[str, Any]:
        logger.info(f"[TaskManager] User {user_id}: '{text[:50]}...'")
        
        # 1. Detect user language if not provided
        detected_lang = await language_detector.detect_language(text)
        response_lang = preferred_lang if preferred_lang != "auto" else detected_lang
        
        # 2. Build full dialogue state from memory + context + intent
        state = await dialogue_manager.prepare_dialogue_state(user_id, text)
        
        # 3. Dispatch to the right agent
        raw_response = await agent_orchestrator.dispatch(user_id, state)
        
        # 4. Translate response if the user's language isn't English
        final_response = await multilingual_responses.format_response(raw_response, response_lang)
        
        # 5. Update memory for continuity
        memory_engine.add_interaction(user_id, text, raw_response)
        
        return {
            "intent": state["intent"],
            "response": final_response,
            "detected_language": detected_lang,
            "response_language": response_lang
        }

task_manager = TaskManager()
