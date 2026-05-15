from typing import Dict, Any

class AnalyticsEngine:
    async def generate_dashboard_data(self, budget: float, expenses: list[dict]) -> dict:
        """
        Processes raw expenses into frontend-ready analytics (pie charts, trend lines).
        """
        category_breakdown = {}
        total_spent = 0
        
        for expense in expenses:
            cat = expense.get("category", "other")
            amt = expense.get("amount", 0.0)
            category_breakdown[cat] = category_breakdown.get(cat, 0) + amt
            total_spent += amt
            
        # Example for pie chart data formatting
        pie_chart_data = [{"name": k.capitalize(), "value": v} for k, v in category_breakdown.items()]
        
        return {
            "total_budget": budget,
            "total_spent": total_spent,
            "remaining": budget - total_spent,
            "category_breakdown": pie_chart_data,
            "health_score": max(0, min(100, int(((budget - total_spent) / budget) * 100))) if budget > 0 else 0
        }

analytics_engine = AnalyticsEngine()
