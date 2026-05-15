import logging

logger = logging.getLogger(__name__)

class IntentEngine:
    async def analyze_intent(self, user_text: str) -> str:
        """
        Detects the user's goal to route to the correct AI Agent.
        """
        text = user_text.lower()
        
        if any(word in text for word in ["translate", "mean", "language", "say"]):
            return "translation"
        elif any(word in text for word in ["scam", "safe", "danger", "police", "help", "emergency"]):
            return "safety"
        elif any(word in text for word in ["book", "reserve", "ticket", "hotel room"]):
            return "booking"
        elif any(word in text for word in ["budget", "expensive", "cheap", "cost", "price"]):
            return "budget"
        elif any(word in text for word in ["recommend", "nearby", "eat", "cafe", "visit"]):
            return "recommendation"
        elif any(word in text for word in ["schedule", "tomorrow", "plan", "move", "itinerary"]):
            return "planner"
            
        return "general_chat"

intent_engine = IntentEngine()
