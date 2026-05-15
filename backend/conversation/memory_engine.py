import logging

logger = logging.getLogger(__name__)

class ConversationMemory:
    def __init__(self):
        self.sessions = {}

    def add_interaction(self, user_id: int, user_msg: str, ai_msg: str):
        if user_id not in self.sessions:
            self.sessions[user_id] = []
        self.sessions[user_id].append({"u": user_msg, "ai": ai_msg})
        # Keep last 10
        self.sessions[user_id] = self.sessions[user_id][-10:]

    def get_context_string(self, user_id: int) -> str:
        history = self.sessions.get(user_id, [])
        if not history:
            return ""
        return "\n".join([f"User: {h['u']}\nAI: {h['ai']}" for h in history])

memory_engine = ConversationMemory()
