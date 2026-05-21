import asyncio
import edge_tts

async def test():
    print("Starting edge_tts...")
    communicate = edge_tts.Communicate("Hello world", "en-US-AriaNeural")
    await communicate.save("test.mp3")
    print("Saved successfully!")

if __name__ == "__main__":
    asyncio.run(test())
