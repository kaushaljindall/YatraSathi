import logging
from typing import Dict, Any
from ws_handler.live_updates import websocket_manager

logger = logging.getLogger(__name__)

class NotificationEngine:
    async def push_alert(self, user_id: int, alert_type: str, message: str, payload: Dict[str, Any]):
        """
        Pushes a real-time WebSocket notification to the frontend.
        """
        logger.info(f"[WS PUSH] User {user_id} | {alert_type.upper()}: {message}")
        
        await websocket_manager.send_personal_message(
            {"type": alert_type, "message": message, "data": payload},
            user_id
        )
        return True

notification_engine = NotificationEngine()
