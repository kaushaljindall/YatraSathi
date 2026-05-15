from ai.llm_service import llm_service

class PlannerAgent:
    async def execute(self, state: dict) -> str:
        """Modifies and optimizes itineraries based on voice/text commands."""
        query = state["query"]
        context = state["context"]
        
        prompt = f"You are YatraSaathi's Planner Agent. The user is in {context['current_city']}. They want to modify their plan: '{query}'. Provide an updated schedule."
        
        return await llm_service.generate_response(prompt, query, temperature=0.5)

planner_agent = PlannerAgent()
