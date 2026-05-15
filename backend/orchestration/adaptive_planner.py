import logging
from ai.llm_service import llm_service
from rag.retriever import retriever

logger = logging.getLogger(__name__)

class AdaptivePlanner:
    async def generate_alternative(self, broken_plan: dict, reason: str) -> str:
        """
        Uses LLM + RAG to generate an immediate, localized alternative to a broken plan.
        """
        logger.info(f"Generating alternative for {broken_plan['activity_type']} due to {reason}")
        
        city = broken_plan.get("city", "the area")
        # Fetch alternatives from RAG
        rag_context = retriever.retrieve_context(f"Indoor alternatives to {broken_plan['next_loc']}", city=city)
        
        system_prompt = f"You are YatraSaathi's Adaptive Planner. The user's plan to visit {broken_plan['next_loc']} is ruined due to: {reason}. Suggest an immediate, nearby alternative using the context below.\n\nContext:\n{rag_context}"
        
        user_prompt = "What should I do right now instead?"
        
        alternative = await llm_service.generate_response(system_prompt, user_prompt, temperature=0.6)
        return alternative

adaptive_planner = AdaptivePlanner()
