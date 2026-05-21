import httpx
import logging
import asyncio
import os

logger = logging.getLogger(__name__)

class Audio2FaceService:
    def __init__(self, a2f_url="http://localhost:8011"):
        self.a2f_url = a2f_url
        self.player_instance = "/World/audio2face/Player"
        self.a2f_instance = "/World/audio2face/CoreFullFace"
        self.blendshape_node = "/World/audio2face/Blendshape"

    async def check_health(self) -> bool:
        """Check if Audio2Face REST API is reachable."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.a2f_url}/status")
                return response.status_code == 200
        except Exception:
            return False

    async def generate_blendshapes(self, audio_path: str, emotion_params: dict = None) -> list[dict]:
        """
        Sends the generated TTS audio to A2F, optionally sets emotion, 
        and extracts the ARKit blendshape frames.
        """
        if not await self.check_health():
            logger.warning("Audio2Face is not running. Returning empty blendshapes.")
            return []

        abs_audio_path = os.path.abspath(audio_path)

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                # 1. Set the audio track in the A2F Player
                await client.post(
                    f"{self.a2f_url}/A2F/Player/SetTrack",
                    json={"a2f_player": self.player_instance, "file_name": abs_audio_path}
                )

                # 2. Set Emotion (if provided)
                if emotion_params:
                    await client.post(
                        f"{self.a2f_url}/A2F/A2E/SetEmotion",
                        json={"a2f_instance": self.a2f_instance, "emotion": emotion_params}
                    )

                # 3. Generate blendshapes via A2F Exporter (Mocked API format for typical headless export)
                # In a real Omniverse setup, this triggers the inference and dumps to a JSON or streams via gRPC.
                # For this implementation, we query a custom REST wrapper or read the exported JSON.
                response = await client.post(
                    f"{self.a2f_url}/A2F/Exporter/ExportBlendshapes",
                    json={"export_directory": os.path.abspath("data/cache"), "format": "json"}
                )
                
                export_data = response.json()
                frames = export_data.get("frames", [])
                
                return frames

            except Exception as e:
                logger.error(f"Failed to generate Audio2Face blendshapes: {e}")
                return []

audio2face_service = Audio2FaceService()
