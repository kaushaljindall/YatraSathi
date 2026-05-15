import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class ExpenseTracker:
    async def categorize_expense(self, description: str, amount: float) -> str:
        """
        AI/Heuristic-based categorization of expenses.
        """
        desc = description.lower()
        if any(word in desc for word in ["restaurant", "cafe", "food", "lunch", "dinner", "pizza"]):
            return "food"
        elif any(word in desc for word in ["uber", "taxi", "bus", "train", "flight", "metro"]):
            return "transport"
        elif any(word in desc for word in ["hotel", "hostel", "airbnb", "stay"]):
            return "accommodation"
        elif any(word in desc for word in ["museum", "ticket", "tour", "guide", "park"]):
            return "activity"
        return "other"

    def calculate_remaining_budget(self, total_budget: float, expenses: list[dict]) -> float:
        total_spent = sum(e.get("amount", 0) for e in expenses)
        return total_budget - total_spent

expense_tracker = ExpenseTracker()
