import logging
from ai.llm_service import llm_service
from rag.retriever import retriever

logger = logging.getLogger(__name__)

class AutonomousPlanner:
    """
    Proactively optimises a user's itinerary without explicit user instruction.
    All suggested changes are surfaced to the user for confirmation — never silently applied.
    """
    async def propose_optimizations(self, trip: dict, conditions: dict) -> dict:
        city = trip.get("destination", "unknown")
        activities = trip.get("activities", [])

        # Gather grounded context on current conditions
        context = retriever.retrieve_context(
            f"best time and alternatives for activities in {city}", city=city
        )

        system_prompt = (
            f"You are YatraSaathi's Autonomous Planner. Based on current conditions "
            f"(weather: {conditions.get('weather','unknown')}, "
            f"crowds: {conditions.get('crowds','unknown')}), "
            f"propose specific improvements to the user's itinerary for {city}.\n\n"
            f"Context:\n{context}\n\n"
            f"CRITICAL: Format your response as a list of clear, actionable suggestions. "
            f"Each suggestion must explain WHY it is recommended."
        )
        user_prompt = f"Current planned activities: {activities}"
        proposals = await llm_service.generate_response(system_prompt, user_prompt, temperature=0.5)

        return {
            "city": city,
            "proposals": proposals,
            "requires_user_confirmation": True,  # Never auto-apply without consent
            "conditions_used": conditions,
        }

autonomous_planner = AutonomousPlanner()
