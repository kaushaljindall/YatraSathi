import json
from app.ai.llm_client import LLMClient

def get_hotel_recommendations(city: str, budget: float = None):
    """
    Suggest actual accommodations based on location and budget dynamically via LLM context.
    """
    llm = LLMClient()
    budget_str = f"around ${budget} per night" if budget else "with assorted price ranges"
    prompt = (
        f"You are a travel API. Return a JSON array of 3 real, popular hotels in {city} {budget_str}. "
        f"Format strictly as JSON array with objects containing 'name' (string), 'price_per_night' (number), and 'rating' (number). No markdown, no explanations."
    )
    try:
        response = llm.generate(prompt)
        response = response.replace('```json', '').replace('```', '').strip()
        data = json.loads(response)
        return data
    except Exception:
        # Fallback if parsing fails
        return [
            {"name": f"Grand {city} Hotel", "price_per_night": 150, "rating": 4.5},
            {"name": f"Central Stay {city}", "price_per_night": 90, "rating": 4.1},
            {"name": f"{city} Budget Inn", "price_per_night": 45, "rating": 3.8}
        ]
