from conversation.memory_engine import memory_engine
from conversation.intent_engine import intent_engine
from conversation.context_manager import context_manager

class DialogueManager:
    async def prepare_dialogue_state(self, user_id: int, user_text: str) -> dict:
        """
        Aggregates memory, context, and intent before passing to Agent Orchestrator.
        """
        intent = await intent_engine.analyze_intent(user_text)
        memory = memory_engine.get_context_string(user_id)
        context = await context_manager.get_active_context(user_id)
        
        return {
            "intent": intent,
            "memory": memory,
            "context": context,
            "query": user_text
        }

dialogue_manager = DialogueManager()
