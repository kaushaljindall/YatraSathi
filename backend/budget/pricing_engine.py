import logging

logger = logging.getLogger(__name__)

class PricingEngine:
    """Local cost intelligence and average pricing storage."""
    def __init__(self):
        # Mock Redis/Postgres caching of city averages
        self.city_averages = {
            "jaipur": {"food": 15.0, "transport": 10.0, "accommodation": 50.0, "activity": 20.0},
            "delhi": {"food": 20.0, "transport": 15.0, "accommodation": 60.0, "activity": 25.0}
        }

    async def get_city_averages(self, city: str) -> dict:
        return self.city_averages.get(city.lower(), {"food": 20.0, "transport": 15.0, "accommodation": 60.0, "activity": 25.0})

    async def analyze_price(self, city: str, category: str, amount: float) -> dict:
        """Determines if a specific expense is overpriced."""
        averages = await self.get_city_averages(city)
        expected_cost = averages.get(category.lower(), 20.0)
        
        ratio = amount / expected_cost
        
        if ratio > 1.8:
            status = "tourist_trap"
        elif ratio > 1.3:
            status = "expensive"
        elif ratio < 0.8:
            status = "cheap"
        else:
            status = "fair"
            
        return {
            "status": status,
            "expected_cost": expected_cost,
            "actual_cost": amount,
            "markup_percentage": (ratio - 1) * 100
        }

pricing_engine = PricingEngine()
