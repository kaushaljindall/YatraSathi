from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.streaming.stream_pipeline import process_audio_stream

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

@router.websocket("/ws/ziva")
async def ziva_websocket(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Receive audio chunk from frontend
            data = await websocket.receive_bytes()
            
            # Stream events back continuously
            async for event in process_audio_stream(data):
                await manager.send_message(event, websocket)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        await manager.send_message({"type": "error", "payload": str(e)}, websocket)
        manager.disconnect(websocket)
