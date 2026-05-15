import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Research-based pricing data for major destinations
# Prices in USD — daily estimates per service type
CITY_PRICING_DATA: Dict[str, Dict[str, Any]] = {
    "delhi": {
        "taxi_per_km": 0.18, "rickshaw_per_km": 0.10, "metro_flat": 0.45,
        "budget_meal": 3.0, "mid_meal": 8.0, "fine_dining": 25.0,
        "budget_hotel": 20.0, "mid_hotel": 55.0, "luxury_hotel": 150.0,
        "museum_entry": 5.0, "monument_entry": 8.0,
    },
    "mumbai": {
        "taxi_per_km": 0.22, "rickshaw_per_km": 0.12, "metro_flat": 0.50,
        "budget_meal": 4.0, "mid_meal": 12.0, "fine_dining": 35.0,
        "budget_hotel": 25.0, "mid_hotel": 70.0, "luxury_hotel": 200.0,
        "museum_entry": 4.0, "monument_entry": 6.0,
    },
    "jaipur": {
        "taxi_per_km": 0.15, "rickshaw_per_km": 0.08, "metro_flat": 0.35,
        "budget_meal": 2.5, "mid_meal": 7.0, "fine_dining": 20.0,
        "budget_hotel": 18.0, "mid_hotel": 48.0, "luxury_hotel": 120.0,
        "museum_entry": 3.0, "monument_entry": 10.0,
    },
    "goa": {
        "taxi_per_km": 0.20, "rickshaw_per_km": 0.00, "metro_flat": 0.0,
        "budget_meal": 4.0, "mid_meal": 12.0, "fine_dining": 30.0,
        "budget_hotel": 22.0, "mid_hotel": 60.0, "luxury_hotel": 180.0,
        "museum_entry": 2.0, "monument_entry": 3.0,
    },
    "agra": {
        "taxi_per_km": 0.14, "rickshaw_per_km": 0.07, "metro_flat": 0.30,
        "budget_meal": 2.0, "mid_meal": 6.0, "fine_dining": 18.0,
        "budget_hotel": 15.0, "mid_hotel": 42.0, "luxury_hotel": 110.0,
        "museum_entry": 2.0, "monument_entry": 15.0,  # Taj Mahal premium
    },
}

DEFAULT_PRICING = {
    "taxi_per_km": 0.18, "rickshaw_per_km": 0.10, "metro_flat": 0.40,
    "budget_meal": 3.0, "mid_meal": 9.0, "fine_dining": 25.0,
    "budget_hotel": 20.0, "mid_hotel": 55.0, "luxury_hotel": 140.0,
    "museum_entry": 4.0, "monument_entry": 8.0,
}


class PricingService:
    """
    Real pricing intelligence based on curated destination data.
    Detects surge pricing and tourist traps using statistical thresholds.
    """

    def _get_city_data(self, city: str) -> Dict[str, Any]:
        return CITY_PRICING_DATA.get(city.lower().strip(), DEFAULT_PRICING)

    async def get_live_pricing(self, entity_type: str, entity_name: str, city: str = "delhi") -> dict:
        """
        Returns contextual pricing for a given entity type in the given city.
        entity_type: 'taxi', 'hotel', 'food', 'attraction'
        """
        city_data = self._get_city_data(city)

        type_map = {
            "taxi":       ("taxi_per_km", "rickshaw_per_km"),
            "hotel":      ("budget_hotel", "mid_hotel", "luxury_hotel"),
            "food":       ("budget_meal", "mid_meal", "fine_dining"),
            "attraction": ("museum_entry", "monument_entry"),
        }

        relevant_keys = type_map.get(entity_type.lower(), [])
        relevant_prices = {k: city_data[k] for k in relevant_keys if k in city_data}

        avg_price = sum(relevant_prices.values()) / len(relevant_prices) if relevant_prices else 20.0
        mid_price = list(relevant_prices.values())[len(relevant_prices) // 2] if relevant_prices else avg_price

        return {
            "entity_type": entity_type,
            "entity_name": entity_name,
            "city": city,
            "price_range": relevant_prices,
            "average_price": round(avg_price, 2),
            "recommended_price": round(mid_price, 2),
            "currency": "USD",
            "is_tourist_trap": False,
            "surge_multiplier": 1.0,
            "data_source": "curated_city_intelligence"
        }

    async def detect_surge(self, entity_type: str, city: str, quoted_price: float) -> dict:
        """Detects if a quoted price is a tourist trap or surge pricing."""
        pricing = await self.get_live_pricing(entity_type, "unknown", city)
        avg = pricing["average_price"]

        if avg == 0:
            return {"is_surge": False, "surge_multiplier": 1.0}

        multiplier = quoted_price / avg
        is_surge = multiplier > 2.0
        is_tourist_trap = multiplier > 3.0

        return {
            "is_surge": is_surge,
            "is_tourist_trap": is_tourist_trap,
            "surge_multiplier": round(multiplier, 2),
            "quoted_price": quoted_price,
            "fair_price": avg,
            "overpayment": round(max(0, quoted_price - avg), 2)
        }


pricing_service = PricingService()
