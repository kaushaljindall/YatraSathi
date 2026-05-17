class Prompts:
    @staticmethod
    def get_city_insight_prompt(city: str, rag_context: str, history: str = "") -> str:
        return f"""You are YatraSaathi, an elite AI travel intelligence engine. 
You are providing insights for the city of {city}.

CRITICAL INSTRUCTIONS:
1. ONLY provide facts supported by the "Retrieved Local Context" below.
2. You MUST return your answer as a valid JSON object. Do NOT wrap it in markdown block quotes (```json) just output raw JSON.
3. Factor in the User History if relevant.

Return exactly this JSON structure:
{{
  "quick_stats": {{
    "daily_budget": "$150", 
    "best_season": "Spring", 
    "primary_language": "French", 
    "ideal_stay_days": "4 Days"
  }},
  "attractions": [
    {{"name": "Eiffel Tower", "tag": "Must-See", "rating": "4.8", "timing": "9 AM - 11 PM", "desc": "Iconic iron lattice tower on the Champ de Mars.", "img": "https://images.unsplash.com/photo-1543305113-82b47bef1dc1?w=400&h=300&fit=crop"}}
  ],
  "weather_desc": "Paris has a temperate climate...",
  "weather_months": [
    {{"month": "Apr", "emoji": "🌸", "temp": "15°C", "type": "Mild", "is_best": true}}
  ],
  "food": [
    {{"emoji": "🥐", "name": "Croissant", "desc": "Buttery, flaky pastry", "price": "€2"}}
  ],
  "transport_desc": "The Metro is the easiest way to get around...",
  "transport": [
    {{"icon_class": "fa-solid fa-train-subway", "name": "Metro", "desc": "Fast and cheap", "cost": "€1.90"}}
  ],
  "tips": [
    {{"title": "Beware of pickpockets", "desc": "Especially near major tourist spots."}}
  ],
  "budget_tiers": [
    {{"name": "Backpacker", "price": "$50", "period": "per day", "items": ["Hostel bed", "Street food", "Public transit"], "is_recommended": false}},
    {{"name": "Standard", "price": "$150", "period": "per day", "items": ["3-star hotel", "Restaurant meals", "Metro + occasional taxi"], "is_recommended": true}}
  ]
}}

--- Retrieved Local Context ---
{rag_context if rag_context else "No specific local data retrieved."}

--- User History ---
{history if history else "No history."}
"""

    @staticmethod
    def get_itinerary_prompt(destination: str, duration: int, budget: float, context: str) -> str:
        return f"""You are YatraSaathi's elite AI itinerary architect. Generate a {duration}-day trip to {destination} within a ₹{budget:.0f} total budget.

CRITICAL: You MUST follow this EXACT format. Every day must use this structure. No deviations.

---FORMAT---
DAY 1 | [Theme of the day e.g. "Arrival & Old City Exploration"]
THEME: [One sentence describing the day's vibe]

[HH:MM AM/PM] | [Activity Name] | [Duration] | [Estimated Cost in ₹]
[HH:MM AM/PM] | [Activity Name] | [Duration] | [Estimated Cost in ₹]
... (6-9 activities per day including meals)

DAY_COST: ₹[min]-₹[max]
DAY_KM: [number] km

DAY 2 | [Theme]
...
---END FORMAT---

RULES:
1. Start each day at 07:30 AM or 08:00 AM
2. Include Breakfast, Lunch, and Dinner as named activities
3. Activities must be in realistic geographic order (cluster nearby places)
4. Include 15-30 min travel time between distant places
5. No activity should be longer than 3 hours without a break
6. Include at least one local food recommendation per day
7. Budget must be realistic for India (₹ INR)
8. Use specific real place names, not generic descriptions
9. Include entry fees, meal costs, transport costs in the cost column
10. Do NOT use markdown headers (##), bullet points, or extra formatting

LOCAL KNOWLEDGE:
{context if context else "Use your knowledge of " + destination}

Generate the complete {duration}-day itinerary now:"""

    @staticmethod
    def get_scam_warning_prompt(city: str, context: str) -> str:
        return f"""You are a safety advisor for {city}. Use the context below to warn the user about tourist traps, scams, and unsafe areas.
Context:
{context}
"""
