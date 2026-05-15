from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        logger.info(f"User {user_id} connected to Live Updates WebSocket")

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            logger.info(f"User {user_id} disconnected")

    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)

websocket_manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await websocket_manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming ping/pong or manual client updates
    except WebSocketDisconnect:
        websocket_manager.disconnect(user_id)
