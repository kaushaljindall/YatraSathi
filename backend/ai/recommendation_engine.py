from ai.llm_service import llm_service
from ai.prompt_engineering import Prompts
from rag.query_engine import query_engine
from rag.memory import memory

class RecommendationEngine:
    async def get_recommendation(self, user_id: int, query: str, city: str) -> dict:
        """
        Orchestrates finding hidden gems and smart recommendations grounded in RAG.
        """
        # Get processed context from RAG engine
        engine_data = query_engine.process_query(user_id=user_id, query=query, city=city)
        
        # Build prompt
        system_prompt = Prompts.get_city_insight_prompt(
            city=engine_data["city"],
            rag_context=engine_data["rag_context"],
            history=engine_data["history_context"]
        )
        
        # Generate response
        raw_response = await llm_service.generate_response(system_prompt, query, temperature=0.6, json_mode=False, key_type="insights")
        
        import json
        import re
        try:
            clean_response = raw_response.strip()
            if clean_response.startswith("```"):
                match = re.search(r'```(?:json)?\s*(.*?)\s*```', clean_response, re.DOTALL)
                if match:
                    clean_response = match.group(1)
            
            # Validate JSON
            parsed = json.loads(clean_response)
            response = json.dumps(parsed)
        except json.JSONDecodeError:
            fallback_json = {
                "quick_stats": {"daily_budget": "N/A", "best_season": "Any", "primary_language": "Unknown", "ideal_stay_days": "3 Days"},
                "attractions": [{"name": "Error formatting response", "tag": "Error", "desc": raw_response}],
                "weather_desc": "Information currently unavailable.",
                "weather_months": [],
                "food": [],
                "transport_desc": "Information unavailable.",
                "transport": [],
                "tips": [],
                "budget_tiers": []
            }
            response = json.dumps(fallback_json)
        
        # Update user memory
        memory.add_interaction(user_id, query, response)
        
        return {
            "city": city,
            "query": query,
            "recommendation": response,
            "sources_used": len(engine_data["rag_context"].split("---")) if engine_data["rag_context"] else 0
        }

recommendation_engine = RecommendationEngine()
