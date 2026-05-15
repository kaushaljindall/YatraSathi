from budget.budget_engine import budget_engine

class BudgetAgent:
    async def execute(self, state: dict) -> str:
        """Answers financial questions and acts as a budget coach."""
        query = state["query"]
        
        # In production, pass actual user budget data
        return "I've checked your budget. You are on track, but I suggest finding a cheaper cafe for lunch to save $15."

budget_agent = BudgetAgent()
