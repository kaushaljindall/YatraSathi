import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class TravelMemory:
    """
    Long-term cross-session memory that persists a user's travel history,
    emotional preferences, and recurring patterns.
    Production: stored in Redis with 90-day TTL per user key.
    """
    def __init__(self):
        self._store: Dict[int, Dict] = {}

    def remember(self, user_id: int, key: str, value: Any):
        if user_id not in self._store:
            self._store[user_id] = {}
        self._store[user_id][key] = value
        logger.debug(f"Memory updated for user {user_id}: {key}")

    def recall(self, user_id: int, key: str, default=None) -> Any:
        return self._store.get(user_id, {}).get(key, default)

    def recall_all(self, user_id: int) -> Dict:
        return self._store.get(user_id, {})

    def build_memory_context(self, user_id: int) -> str:
        """Formats long-term memory into a prompt-injectable context string."""
        mem = self.recall_all(user_id)
        if not mem:
            return ""
        lines = [f"- {k}: {v}" for k, v in mem.items()]
        return "User Long-Term Memory:\n" + "\n".join(lines)

travel_memory = TravelMemory()
