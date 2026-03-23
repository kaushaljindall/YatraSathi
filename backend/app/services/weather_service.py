import json
from app.ai.llm_client import LLMClient

def get_weather_forecast(city: str, date: str):
    """
    Fetch realistic weather estimates for a destination on a specific date using LLM.
    """
    llm = LLMClient()
    prompt = (
        f"You are a weather API. It is requested to get realistic estimated weather for {city} around the date {date}. "
        f"Return strictly a JSON object containing 'city' (string), 'date' (string), 'condition' (string, e.g., 'Sunny', 'Rainy', 'Cloudy'), "
        f"and 'temperature_c' (number representing celsius). No markdown blocks or explanations. Just raw JSON."
    )
    
    try:
        response = llm.generate(prompt)
        response = response.replace('```json', '').replace('```', '').strip()
        data = json.loads(response)
        return data
    except Exception:
        # Fallback
        return {"city": city, "date": date, "condition": "Sunny", "temperature_c": 25}
