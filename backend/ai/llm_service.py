import httpx
import logging
from config.settings import settings

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama3-8b-8192"

    async def generate_response(self, system_prompt: str, user_query: str, temperature: float = 0.5, json_mode: bool = False, key_type: str = "default") -> str:
        """
        Asynchronously calls the Groq LLM API with the injected context and prompt.
        Uses key_type to distribute load across multiple Groq API keys to avoid rate limits.
        """
        # Select the correct API key based on the service requesting it
        active_key = self.api_key
        if key_type == "translation" and settings.GROQ_API_KEY_TRANSLATION:
            active_key = settings.GROQ_API_KEY_TRANSLATION
        elif key_type == "planner" and settings.GROQ_API_KEY_PLANNER:
            active_key = settings.GROQ_API_KEY_PLANNER
        elif key_type == "insights" and settings.GROQ_API_KEY_INSIGHTS:
            active_key = settings.GROQ_API_KEY_INSIGHTS

        if not active_key or active_key == "your_groq_api_key_here":
            logger.warning("Groq API key not configured. Returning mock response.")
            return "AI Generation Error: GROQ API Key missing."

        try:
            payload = {
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_query}
                ],
                "temperature": temperature
            }
            if json_mode:
                payload["response_format"] = {"type": "json_object"}

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.base_url,
                    headers={"Authorization": f"Bearer {active_key}"},
                    json=payload,
                    timeout=60.0
                )
                
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
            
        except httpx.HTTPStatusError as e:
            error_msg = f"LLM generation failed for {key_type} (HTTP {e.response.status_code}): {e.response.text}"
            logger.error(error_msg)
            return f"An error occurred while generating the AI response. Please try again later. [DEBUG: {error_msg}]"
        except Exception as e:
            error_msg = f"LLM generation failed for {key_type}: {str(e)}"
            logger.error(error_msg)
            return f"An error occurred while generating the AI response. Please try again later. [DEBUG: {error_msg}]"

llm_service = LLMService()
