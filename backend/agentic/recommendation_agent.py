from ai.recommendation_engine import recommendation_engine

class RecommendationAgent:
    async def execute(self, state: dict, user_id: int) -> str:
        """Finds nearby attractions, food, or experiences."""
        query = state["query"]
        city = state["context"]["current_city"]
        
        result = await recommendation_engine.get_recommendation(user_id, query, city)
        return result["recommendation"]

recommendation_agent = RecommendationAgent()
