import logging

logger = logging.getLogger(__name__)

class OverspendingDetector:
    async def analyze_burn_rate(self, total_budget: float, duration_days: int, current_day: int, expenses: list[dict]) -> dict:
        """
        Calculates if the user is spending too fast.
        """
        if duration_days <= 0 or current_day <= 0:
            return {"status": "normal", "message": "Insufficient data to calculate burn rate."}
            
        daily_target = total_budget / duration_days
        total_spent = sum(e.get("amount", 0) for e in expenses)
        
        expected_spend = daily_target * current_day
        
        if total_spent > expected_spend * 1.3:
            return {
                "status": "critical",
                "burn_rate_diff": total_spent - expected_spend,
                "message": f"You are spending 30%+ faster than planned. Reduce daily expenses to ${(total_budget - total_spent) / max(1, duration_days - current_day):.2f}"
            }
        elif total_spent > expected_spend * 1.1:
            return {
                "status": "warning",
                "burn_rate_diff": total_spent - expected_spend,
                "message": "You are slightly over budget. Watch your food and transport expenses."
            }
            
        return {"status": "healthy", "message": "You are on track with your budget."}

overspending_detector = OverspendingDetector()
