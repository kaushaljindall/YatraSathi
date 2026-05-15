from ai.llm_service import llm_service
from ai.prompt_engineering import Prompts
from rag.retriever import retriever

class ItineraryAI:
    async def generate(self, destination: str, duration: int, budget: float, preferences: list) -> str:
        """
        Intelligent itinerary generation incorporating RAG data for realistic planning.
        """
        # Fetch destination context
        context = retriever.retrieve_context(f"Top attractions and travel routes in {destination}", city=destination, top_k=6)
        
        system_prompt = Prompts.get_itinerary_prompt(destination, duration, budget, context)
        user_query = f"Create a realistic day-by-day plan. I like: {', '.join(preferences)}. "
        
        return await llm_service.generate_response(system_prompt, user_query, temperature=0.7)

itinerary_ai = ItineraryAI()
