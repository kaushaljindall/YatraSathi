from services.pricing_service import pricing_service

class PricingEngine:
    async def analyze_budget_impact(self, entity_type: str, entity_name: str, user_budget_status: str) -> dict:
        """Detects surge pricing and tourist traps."""
        pricing = await pricing_service.get_live_pricing(entity_type, entity_name)
        
        is_critical = pricing["surge_multiplier"] > 1.3 and user_budget_status == "tight"
        
        return {
            "pricing": pricing,
            "is_critical": is_critical,
            "warning": "Surge pricing detected! Consider alternative." if is_critical else "Price normal."
        }

pricing_engine = PricingEngine()
