from ai.llm_service import llm_service

class FinancialAI:
    async def generate_smart_recommendations(self, city: str, budget_status: dict, category_breakdown: list) -> str:
        """
        Uses Groq LLM to generate plain-text, contextual financial advice based on the user's live spending.
        """
        system_prompt = f"You are YatraSaathi's Financial AI Advisor for trips to {city}. The user is tracking their expenses."
        
        user_prompt = f"""
Current Status: {budget_status['message']}
Spending Breakdown: {category_breakdown}

Provide 3 brief, highly specific tips to optimize their spending in {city}. Suggest local, cheaper alternatives for their highest spend category.
"""
        return await llm_service.generate_response(system_prompt, user_prompt, temperature=0.5)

financial_ai = FinancialAI()
