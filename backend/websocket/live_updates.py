from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from typing import Optional
import logging
import json

from auth.security import decode_token

logger = logging.getLogger(__name__)
router = APIRouter()


class ConnectionManager:
    """Manages authenticated WebSocket connections keyed by user_id."""

    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        logger.info(f"User {user_id} connected to Live Updates WebSocket")
        await self.send_personal_message(
            {"type": "connected", "message": "Real-time updates active.", "user_id": user_id},
            user_id
        )

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            logger.info(f"User {user_id} disconnected from WebSocket")

    async def send_personal_message(self, message: dict, user_id: int):
        ws = self.active_connections.get(user_id)
        if ws:
            try:
                await ws.send_json(message)
            except Exception as e:
                logger.error(f"Failed to send WS message to user {user_id}: {e}")
                self.disconnect(user_id)

    async def broadcast(self, message: dict):
        """Send a message to all connected users."""
        disconnected = []
        for uid, ws in self.active_connections.items():
            try:
                await ws.send_json(message)
            except Exception:
                disconnected.append(uid)
        for uid in disconnected:
            self.disconnect(uid)

    def is_connected(self, user_id: int) -> bool:
        return user_id in self.active_connections


websocket_manager = ConnectionManager()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: int,
    token: Optional[str] = Query(default=None)
):
    """
    Authenticated WebSocket endpoint.
    Connect with: ws://host/ws/{user_id}?token=<jwt>
    
    Handles incoming commands:
      {"type": "ping"}                    → pong response
      {"type": "subscribe_trip", "trip_id": 123}  → subscribe to trip updates
      {"type": "chat", "message": "..."}  → real-time chat relay
    """
    # Token validation
    if token:
        payload = decode_token(token)
        if not payload or str(payload.get("sub")) != str(user_id):
            await websocket.close(code=4001, reason="Unauthorized")
            return
    else:
        # Allow connection without token for dev — log warning
        logger.warning(f"WS connection for user {user_id} without token (dev mode)")

    await websocket_manager.connect(websocket, user_id)

    try:
        while True:
            raw = await websocket.receive_text()

            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                await websocket_manager.send_personal_message(
                    {"type": "error", "message": "Invalid JSON payload"},
                    user_id
                )
                continue

            msg_type = data.get("type", "unknown")

            if msg_type == "ping":
                await websocket_manager.send_personal_message(
                    {"type": "pong", "status": "alive"},
                    user_id
                )

            elif msg_type == "subscribe_trip":
                trip_id = data.get("trip_id")
                await websocket_manager.send_personal_message(
                    {"type": "subscribed", "trip_id": trip_id,
                     "message": f"Subscribed to real-time updates for trip {trip_id}"},
                    user_id
                )

            elif msg_type == "chat":
                # Relay to conversation pipeline
                from agentic.task_manager import task_manager
                try:
                    result = await task_manager.handle_text_query(
                        user_id=user_id,
                        text=data.get("message", ""),
                        preferred_lang=data.get("lang", "en")
                    )
                    await websocket_manager.send_personal_message(
                        {"type": "chat_response", **result},
                        user_id
                    )
                except Exception as e:
                    logger.error(f"WS chat failed for user {user_id}: {e}")
                    await websocket_manager.send_personal_message(
                        {"type": "error", "message": "Chat processing failed"},
                        user_id
                    )

            elif msg_type == "get_status":
                await websocket_manager.send_personal_message(
                    {"type": "status", "connected_users": len(websocket_manager.active_connections)},
                    user_id
                )

            else:
                await websocket_manager.send_personal_message(
                    {"type": "error", "message": f"Unknown command: {msg_type}"},
                    user_id
                )

    except WebSocketDisconnect:
        websocket_manager.disconnect(user_id)
    except Exception as e:
        logger.error(f"WebSocket error for user {user_id}: {e}")
        websocket_manager.disconnect(user_id)
