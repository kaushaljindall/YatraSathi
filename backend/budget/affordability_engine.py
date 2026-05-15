from budget.pricing_engine import pricing_engine
import logging

logger = logging.getLogger(__name__)

class AffordabilityEngine:
    async def analyze_sustainability(self, trip_data: dict) -> dict:
        """
        Determines if the overall trip plan is financially sustainable given the budget.
        """
        city = trip_data.get("destination", "unknown")
        budget = trip_data.get("budget", 0)
        duration = trip_data.get("duration", 1)
        
        averages = await pricing_engine.get_city_averages(city)
        daily_expected = averages["food"] + averages["transport"] + averages["accommodation"] + averages["activity"]
        total_expected = daily_expected * duration
        
        is_affordable = budget >= total_expected
        
        return {
            "is_affordable": is_affordable,
            "expected_cost": total_expected,
            "shortfall": total_expected - budget if not is_affordable else 0,
            "message": "Trip fits within budget comfortably." if is_affordable else f"You may need an extra ${total_expected - budget:.0f} or need to cut back on accommodation/activities."
        }

affordability_engine = AffordabilityEngine()
