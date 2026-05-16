import asyncio
import os
import sys
import httpx
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv(".env")

API_KEY = os.getenv("GROQ_API_KEY")
BASE_URL = "https://api.groq.com/openai/v1/chat/completions"

async def test():
    print(f"Using API key: {API_KEY[:15]}...")
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            BASE_URL,
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {"role": "system", "content": "You are a helpful travel assistant."},
                    {"role": "user", "content": "Plan a 3 day trip to Paris in brief."}
                ],
                "temperature": 0.5
            },
            timeout=30.0
        )
    print("Status:", resp.status_code)
    print("Body:", resp.text[:1000])

asyncio.run(test())
