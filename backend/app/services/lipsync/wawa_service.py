import asyncio
import os
from app.core.cache import generate_cache_key, get_cache, set_cache

class WawaLipsyncService:
    def __init__(self, model_path: str = "models/wawa_model.pth"):
        self.model_path = model_path
        self.python_env = "python" # Assumes correct environment with wawa-lipsync installed

    async def generate_lipsync(self, audio_path: str, avatar_video_path: str, output_path: str) -> str:
        """
        Invokes wawa-lipsync non-blockingly via subprocess and caches the generated mp4.
        """
        cache_key = await generate_cache_key("lipsync", audio=audio_path, avatar=avatar_video_path)
        cached = await get_cache(cache_key)
        if cached and os.path.exists(cached):
            return cached

        # wawa-lipsync inference command
        cmd = [
            self.python_env, "inference.py",
            "--checkpoint_path", self.model_path,
            "--face", avatar_video_path,
            "--audio", audio_path,
            "--outfile", output_path,
            "--fps", "30"
        ]

        # Use create_subprocess_exec for async execution to avoid event loop blocking
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()

        if process.returncode != 0:
            print(f"Warning: Wawa-lipsync failed or not installed. Error: {stderr.decode()}")
            # Fallback to returning original avatar video if lipsync fails
            return avatar_video_path

        await set_cache(cache_key, output_path, ttl=86400)
        return output_path

wawa_service = WawaLipsyncService()
