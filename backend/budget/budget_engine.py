import logging
from budget.expense_tracker import expense_tracker
from budget.pricing_engine import pricing_engine
from budget.scam_detection import scam_detector
from budget.overspending_detector import overspending_detector
from budget.analytics_engine import analytics_engine
from budget.affordability_engine import affordability_engine
from budget.financial_ai import financial_ai

logger = logging.getLogger(__name__)

class BudgetOrchestrator:
    """The master engine coordinating all budget modules."""
    
    async def process_new_expense(self, city: str, description: str, amount: float, trip_data: dict) -> dict:
        """
        Runs the full intelligence pipeline when a user adds a new expense.
        """
        logger.info(f"Processing new expense: {description} for ${amount}")
        
        # 1. Categorize
        category = await expense_tracker.categorize_expense(description, amount)
        
        # 2. Pricing Intelligence
        pricing_analysis = await pricing_engine.analyze_price(city, category, amount)
        
        # 3. Scam Detection
        scam_data = await scam_detector.detect_scam(city, description, category, amount, pricing_analysis)
        
        return {
            "category": category,
            "pricing_analysis": pricing_analysis,
            "scam_alert": scam_data
        }
        
    async def get_budget_summary(self, city: str, total_budget: float, duration: int, current_day: int, expenses: list) -> dict:
        """
        Generates the full dashboard payload, including overspending checks and AI recommendations.
        """
        # 1. Analytics Dashboard
        analytics = await analytics_engine.generate_dashboard_data(total_budget, expenses)
        
        # 2. Burn Rate Check
        burn_rate = await overspending_detector.analyze_burn_rate(total_budget, duration, current_day, expenses)
        
        # 3. AI Smart Recommendations (only generate if needed, mock generation if burn rate is high)
        ai_advice = "Your budget is perfectly optimized."
        if burn_rate["status"] != "healthy":
            ai_advice = await financial_ai.generate_smart_recommendations(city, burn_rate, analytics["category_breakdown"])
            
        return {
            "analytics": analytics,
            "burn_rate": burn_rate,
            "ai_advice": ai_advice
        }

budget_engine = BudgetOrchestrator()
