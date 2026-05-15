from ai.llm_service import llm_service

class SafetyAgent:
    async def execute(self, state: dict) -> str:
        """Provides emergency numbers, scam warnings, and safe routes."""
        query = state["query"]
        city = state["context"]["current_city"]
        
        prompt = f"You are YatraSaathi's Safety Agent. Provide crucial safety or emergency advice for a traveler in {city} asking: '{query}'."
        return await llm_service.generate_response(prompt, query, temperature=0.3)

safety_agent = SafetyAgent()
