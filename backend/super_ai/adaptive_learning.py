import logging
from collections import defaultdict
from typing import Dict, Any

logger = logging.getLogger(__name__)

class AdaptiveLearningEngine:
    """
    Continuously builds implicit user preference models from interaction patterns.
    No explicit user input needed — the system learns from behaviour.
    """

    def __init__(self):
        # In production: persisted in Redis or user profile in DB
        self._profiles: Dict[int, Dict[str, Any]] = defaultdict(lambda: {
            "pace":          "moderate",   # slow | moderate | fast
            "budget_style":  "balanced",   # budget | balanced | luxury
            "food_openness": "medium",     # low | medium | adventurous
            "solo":          True,
            "interaction_count": 0,
            "destinations_visited": [],
            "top_intents": defaultdict(int),
        })

    def record_interaction(self, user_id: int, intent: str, trip_data: Dict = None):
        profile = self._profiles[user_id]
        profile["interaction_count"] += 1
        profile["top_intents"][intent] += 1

        if trip_data:
            dest = trip_data.get("destination")
            if dest and dest not in profile["destinations_visited"]:
                profile["destinations_visited"].append(dest)

            # Infer budget style from trip budgets
            budget = trip_data.get("budget", 0)
            if budget < 300:
                profile["budget_style"] = "budget"
            elif budget > 1500:
                profile["budget_style"] = "luxury"
            else:
                profile["budget_style"] = "balanced"

    def get_profile(self, user_id: int) -> Dict[str, Any]:
        profile = dict(self._profiles[user_id])
        profile["top_intents"] = dict(profile["top_intents"])
        return profile

    def get_recommendation_bias(self, user_id: int) -> str:
        """Returns a system prompt modifier to bias recommendations toward the user's style."""
        p = self._profiles[user_id]
        return (
            f"User preference profile: budget style='{p['budget_style']}', "
            f"travel pace='{p['pace']}', food openness='{p['food_openness']}'. "
            f"Tailor all suggestions to these preferences."
        )

adaptive_learning = AdaptiveLearningEngine()
