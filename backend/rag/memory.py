from typing import Dict, Any

class UserMemory:
    """Lightweight in-memory state tracking for conversational context.
    In production, this is backed by Redis."""
    def __init__(self):
        self._history: Dict[int, list] = {}
        self._preferences: Dict[int, Dict[str, Any]] = {}

    def add_interaction(self, user_id: int, query: str, response: str):
        if user_id not in self._history:
            self._history[user_id] = []
        self._history[user_id].append({"query": query, "response": response})
        # Keep last 5 interactions to avoid token overflow
        if len(self._history[user_id]) > 5:
            self._history[user_id].pop(0)

    def get_history_context(self, user_id: int) -> str:
        history = self._history.get(user_id, [])
        if not history:
            return ""
        context = "Previous Conversation:\n"
        for idx, interaction in enumerate(history):
            context += f"User: {interaction['query']}\nAI: {interaction['response'][:100]}...\n"
        return context

memory = UserMemory()
