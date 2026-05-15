import logging
from super_ai.predictive_core import predictive_core
from budget.overspending_detector import overspending_detector
from datetime import datetime

logger = logging.getLogger(__name__)

class TripSimulator:
    """
    Simulates an entire itinerary before it begins to identify risks:
    weather disruptions, budget overruns, crowd conflicts, and timing gaps.
    """
    async def simulate(self, trip: dict) -> dict:
        city = trip.get("destination", "unknown")
        budget = trip.get("budget", 1000)
        duration = trip.get("duration", 3)
        activities = trip.get("activities", [])
        month = datetime.utcnow().month

        risks = []
        warnings = []
        score = 100  # starts perfect, deductions applied per risk

        # 1. Weather risk
        risk_assessment = await predictive_core.full_risk_assessment(city, 14, month, budget)
        if risk_assessment["risk_level"] == "high":
            risks.append("High weather/crowd disruption risk detected.")
            warnings += risk_assessment["recommendations"]
            score -= 30
        elif risk_assessment["risk_level"] == "moderate":
            score -= 15

        # 2. Budget sustainability
        burn_check = await overspending_detector.analyze_burn_rate(budget, duration, 0, [])
        if burn_check["status"] == "critical":
            risks.append("Budget may be insufficient for this trip duration.")
            score -= 25

        # 3. Activity count vs duration
        activities_per_day = len(activities) / max(duration, 1)
        if activities_per_day > 4:
            risks.append("Itinerary may be too packed — risk of travel fatigue.")
            score -= 15
            warnings.append("Consider reducing to 3 activities per day for comfort.")

        viability = "excellent" if score >= 80 else "good" if score >= 60 else "needs_adjustment"

        return {
            "destination": city,
            "simulation_score": max(score, 0),
            "viability": viability,
            "risks": risks,
            "warnings": warnings,
            "risk_detail": risk_assessment,
        }

trip_simulator = TripSimulator()
