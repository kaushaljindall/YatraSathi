import asyncio
import os
from dotenv import load_dotenv
load_dotenv("d:/Projects/YatraSathi/backend/.env")

from backend.ai.llm_service import llm_service

async def test():
    try:
        res = await llm_service.generate_response("You are a helpful assistant.", "Plan a 3 day trip to Paris")
        print("Response:", res)
    except Exception as e:
        print("Error:", e)

asyncio.run(test())
