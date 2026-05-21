import asyncio
import edge_tts

async def test():
    print("Starting edge_tts...")
    communicate = edge_tts.Communicate("[Translated to HI]: Hi, my name is Kaushal and I am a developer of Yatra Sati.", "hi-IN-SwaraNeural")
    await communicate.save("test_hindi.mp3")
    print("Saved successfully!")

if __name__ == "__main__":
    asyncio.run(test())
