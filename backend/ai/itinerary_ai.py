from ai.llm_service import llm_service
from ai.prompt_engineering import Prompts
from rag.retriever import retriever

class ItineraryAI:
    async def generate(self, destination: str, duration: int, budget: float, preferences: list) -> str:
        """
        Intelligent itinerary generation incorporating RAG data for realistic planning.
        """
        # Fetch destination context
        context = retriever.retrieve_context(f"Top attractions and travel routes in {destination}", city=destination, top_k=6)
        
        system_prompt = Prompts.get_itinerary_prompt(destination, duration, budget, context)
        user_query = f"Create a realistic day-by-day plan. I like: {', '.join(preferences)}. "
        
        raw_response = await llm_service.generate_response(system_prompt, user_query, temperature=0.7, json_mode=False, key_type="planner")
        
        import json
        import re
        try:
            # Strip markdown formatting if the LLM included it (e.g., ```json ... ```)
            clean_response = raw_response.strip()
            if clean_response.startswith("```"):
                # Use regex to extract everything between the first ```... and the last ```
                match = re.search(r'```(?:json)?\s*(.*?)\s*```', clean_response, re.DOTALL)
                if match:
                    clean_response = match.group(1)
            
            # Parse the string returned by Groq to ensure it's valid JSON
            parsed = json.loads(clean_response)
            
            # If the LLM returned an array instead of an object, wrap it
            if isinstance(parsed, list):
                parsed = {"city": destination, "days": [{"day": 1, "title": f"Exploring {destination}", "activities": parsed}]}
                
            # If it's an object but missing 'days', wrap it
            elif isinstance(parsed, dict) and "days" not in parsed:
                parsed = {"city": destination, "days": [{"day": 1, "title": f"Exploring {destination}", "activities": [parsed]}]}
                
            return json.dumps(parsed)
        except json.JSONDecodeError:
            # Fallback if the LLM completely failed to output JSON
            fallback_json = {
                "city": destination,
                "days": [{
                    "day": 1,
                    "title": f"Exploring {destination}",
                    "activities": [{"time": "All Day", "activity": raw_response}]
                }]
            }
            return json.dumps(fallback_json)

itinerary_ai = ItineraryAI()
