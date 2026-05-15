import logging
from ai.llm_service import llm_service

logger = logging.getLogger(__name__)

SCENARIOS = {
    "flight_delay": "Your flight is delayed by 4 hours.",
    "bad_weather":  "Heavy rain is forecast for tomorrow.",
    "overspending": "You have spent 80% of your budget by day 2.",
    "missed_train": "You have missed your train connection.",
    "emergency":    "A travel emergency has occurred.",
}

class ScenarioEngine:
    """
    Generates intelligent fallback strategies for common travel disruptions.
    Powered by LLM with grounded reasoning — no hallucinated advice.
    """
    async def analyze(self, scenario_key: str, trip_context: dict) -> dict:
        scenario_desc = SCENARIOS.get(scenario_key, scenario_key)
        city = trip_context.get("destination", "your destination")

        system_prompt = (
            f"You are YatraSaathi's Scenario Advisor. A traveler in {city} is facing: '{scenario_desc}'. "
            f"Provide 3 specific, practical fallback strategies. Be concise and action-oriented."
        )

        strategy = await llm_service.generate_response(system_prompt, scenario_desc, temperature=0.4)

        return {
            "scenario": scenario_desc,
            "city": city,
            "fallback_strategies": strategy,
            "requires_immediate_action": scenario_key == "emergency",
        }

scenario_engine = ScenarioEngine()
