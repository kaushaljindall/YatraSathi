import httpx
import logging
from config.settings import settings

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama3-8b-8192"

    async def generate_response(self, system_prompt: str, user_query: str, temperature: float = 0.5) -> str:
        """
        Asynchronously calls the Groq LLM API with the injected context and prompt.
        """
        if not self.api_key or self.api_key == "your_groq_api_key_here":
            logger.warning("Groq API key not configured. Returning mock response.")
            return "AI Generation Error: GROQ API Key missing."

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.base_url,
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_query}
                        ],
                        "temperature": temperature
                    },
                    timeout=30.0
                )
                
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
            
        except Exception as e:
            logger.error(f"LLM generation failed: {str(e)}")
            return "An error occurred while generating the AI response. Please try again later."

llm_service = LLMService()
