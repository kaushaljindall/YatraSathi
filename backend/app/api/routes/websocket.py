from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.streaming.stream_pipeline import process_audio_stream
import json

router = APIRouter()

class WebSocketManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)

manager = WebSocketManager()

@router.websocket("/ws/ziva/audio")
async def ziva_websocket(websocket: WebSocket):
    await manager.connect(websocket)
    target_lang = "en"
    audio_buffer = bytearray()
    
    try:
        while True:
            # Receive message from frontend
            message = await websocket.receive()
            
            if "text" in message:
                try:
                    data = json.loads(message["text"])
                    if data.get("type") == "config":
                        target_lang = data.get("target_lang", "en")
                    elif data.get("type") == "stop_recording":
                        # Process buffered audio
                        if len(audio_buffer) > 0:
                            async for event in process_audio_stream(bytes(audio_buffer), target_lang):
                                await manager.send_message(event, websocket)
                        audio_buffer.clear()
                except json.JSONDecodeError:
                    pass
            elif "bytes" in message:
                audio_buffer.extend(message["bytes"])
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        await manager.send_message({"type": "error", "message": str(e)}, websocket)
        manager.disconnect(websocket)

