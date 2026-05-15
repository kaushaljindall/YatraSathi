import logging

logger = logging.getLogger(__name__)

class TravelPatternAI:
    """Builds behavioral profiles from trip history to improve future recommendations."""

    def analyze_patterns(self, trip_history: list[dict]) -> dict:
        if not trip_history:
            return {"profile": "new_user", "insights": []}

        total_budget = sum(t.get("budget", 0) for t in trip_history)
        avg_duration = sum(t.get("duration", 0) for t in trip_history) / len(trip_history)
        destinations = [t.get("destination", "") for t in trip_history]

        profile = "budget_traveler" if total_budget / len(trip_history) < 500 else "comfort_traveler"

        insights = [
            f"Average trip length: {avg_duration:.1f} days.",
            f"Visited destinations: {', '.join(set(destinations))}.",
            f"Travel style detected: {profile.replace('_', ' ').title()}.",
        ]

        return {"profile": profile, "insights": insights, "trip_count": len(trip_history)}

travel_pattern_ai = TravelPatternAI()
