import os
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage, SystemMessage
from app.config import settings

class LLMClient:
    def __init__(self):
        # We assume the user has set the key in .env
        api_key = settings.groq_api_key
        try:
            self.llm = ChatGroq(
                temperature=0.7, 
                groq_api_key=api_key, 
                model_name="llama-3.1-8b-instant" # Use recent supported Groq model
            )
        except Exception:
            self.llm = None
            
    def generate(self, prompt: str) -> str:
        """Call the LLM to generate text."""
        if not self.llm:
            return f"[Mocked LLM Response for prompt: {prompt}]"
            
        messages = [
            SystemMessage(content="You are a professional travel planner API assistant."),
            HumanMessage(content=prompt)
        ]
        response = self.llm.invoke(messages)
        return response.content

    def chat(self, user_message: str, session_id: str) -> str:
        """Interact with the travel assistant."""
        if not self.llm:
            return f"[Mocked Chat Response to: {user_message}]"
            
        return self.generate(f"User asking about travel: {user_message}")
