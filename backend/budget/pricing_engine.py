import logging
from typing import Dict

logger = logging.getLogger(__name__)


class PricingEngine:
    """
    Cost intelligence engine with real city averages for major Indian & global destinations.
    Averages are research-based daily cost estimates (USD) per category.
    """

    CITY_AVERAGES: Dict[str, Dict[str, float]] = {
        # India — Tier 1
        "delhi":     {"food": 18.0, "transport": 12.0, "accommodation": 55.0, "activity": 22.0, "shopping": 30.0},
        "mumbai":    {"food": 22.0, "transport": 14.0, "accommodation": 70.0, "activity": 28.0, "shopping": 40.0},
        "bangalore": {"food": 20.0, "transport": 13.0, "accommodation": 65.0, "activity": 25.0, "shopping": 35.0},
        "chennai":   {"food": 16.0, "transport": 10.0, "accommodation": 50.0, "activity": 20.0, "shopping": 28.0},
        "hyderabad": {"food": 17.0, "transport": 11.0, "accommodation": 55.0, "activity": 22.0, "shopping": 30.0},
        "kolkata":   {"food": 14.0, "transport": 9.0,  "accommodation": 45.0, "activity": 18.0, "shopping": 25.0},
        # India — Tier 2 / Tourist
        "jaipur":    {"food": 14.0, "transport": 9.0,  "accommodation": 48.0, "activity": 18.0, "shopping": 22.0},
        "agra":      {"food": 12.0, "transport": 10.0, "accommodation": 42.0, "activity": 15.0, "shopping": 18.0},
        "varanasi":  {"food": 10.0, "transport": 8.0,  "accommodation": 35.0, "activity": 12.0, "shopping": 15.0},
        "goa":       {"food": 20.0, "transport": 12.0, "accommodation": 60.0, "activity": 25.0, "shopping": 30.0},
        "udaipur":   {"food": 15.0, "transport": 10.0, "accommodation": 55.0, "activity": 20.0, "shopping": 22.0},
        "mysore":    {"food": 12.0, "transport": 8.0,  "accommodation": 40.0, "activity": 15.0, "shopping": 18.0},
        "rishikesh": {"food": 10.0, "transport": 7.0,  "accommodation": 30.0, "activity": 18.0, "shopping": 12.0},
        "amritsar":  {"food": 12.0, "transport": 8.0,  "accommodation": 38.0, "activity": 14.0, "shopping": 16.0},
        "shimla":    {"food": 14.0, "transport": 10.0, "accommodation": 45.0, "activity": 16.0, "shopping": 18.0},
        "manali":    {"food": 13.0, "transport": 11.0, "accommodation": 40.0, "activity": 20.0, "shopping": 15.0},
        "darjeeling":{"food": 11.0, "transport": 9.0,  "accommodation": 38.0, "activity": 14.0, "shopping": 14.0},
        "kerala":    {"food": 15.0, "transport": 10.0, "accommodation": 50.0, "activity": 22.0, "shopping": 20.0},
        "kochi":     {"food": 16.0, "transport": 10.0, "accommodation": 52.0, "activity": 22.0, "shopping": 22.0},
        "pune":      {"food": 18.0, "transport": 11.0, "accommodation": 55.0, "activity": 22.0, "shopping": 28.0},
        # Global
        "paris":     {"food": 35.0, "transport": 18.0, "accommodation": 150.0, "activity": 40.0, "shopping": 60.0},
        "london":    {"food": 40.0, "transport": 22.0, "accommodation": 180.0, "activity": 45.0, "shopping": 70.0},
        "dubai":     {"food": 30.0, "transport": 15.0, "accommodation": 130.0, "activity": 50.0, "shopping": 80.0},
        "bangkok":   {"food": 12.0, "transport": 8.0,  "accommodation": 40.0, "activity": 20.0, "shopping": 30.0},
        "singapore": {"food": 25.0, "transport": 15.0, "accommodation": 120.0, "activity": 35.0, "shopping": 50.0},
        "bali":      {"food": 10.0, "transport": 8.0,  "accommodation": 45.0, "activity": 22.0, "shopping": 25.0},
        "tokyo":     {"food": 30.0, "transport": 20.0, "accommodation": 100.0, "activity": 35.0, "shopping": 60.0},
    }

    DEFAULT_AVERAGES = {"food": 18.0, "transport": 12.0, "accommodation": 55.0, "activity": 22.0, "shopping": 28.0}

    async def get_city_averages(self, city: str) -> dict:
        """Returns research-based daily cost averages for a city."""
        city_key = city.lower().strip()
        return self.CITY_AVERAGES.get(city_key, self.DEFAULT_AVERAGES)

    async def analyze_price(self, city: str, category: str, amount: float) -> dict:
        """
        Determines if a specific expense is overpriced relative to real city averages.
        Returns status, markup percentage, and contextual advice.
        """
        averages = await self.get_city_averages(city)
        category_key = category.lower().strip()
        expected_cost = averages.get(category_key, self.DEFAULT_AVERAGES.get(category_key, 20.0))

        if expected_cost == 0:
            return {"status": "fair", "expected_cost": 0, "actual_cost": amount, "markup_percentage": 0}

        ratio = amount / expected_cost

        if ratio > 2.5:
            status = "tourist_trap"
        elif ratio > 1.5:
            status = "expensive"
        elif ratio > 1.2:
            status = "slightly_high"
        elif ratio < 0.5:
            status = "very_cheap"
        elif ratio < 0.8:
            status = "cheap"
        else:
            status = "fair"

        return {
            "status": status,
            "expected_cost": expected_cost,
            "actual_cost": amount,
            "markup_percentage": round((ratio - 1) * 100, 1),
            "city": city,
            "category": category
        }


pricing_engine = PricingEngine()
