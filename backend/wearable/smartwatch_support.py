import logging

logger = logging.getLogger(__name__)

class SmartWatchBridge:
    """
    Wearable-ready notification bridge.
    Production: integrates with Apple WatchKit API / Wear OS notification channels.
    """
    async def send_notification(self, user_id: int, title: str, body: str, action_type: str = "info") -> dict:
        """
        Sends a travel alert formatted for a wearable device (compact, glanceable).
        """
        payload = {
            "user_id": user_id,
            "wearable_notification": {
                "title": title[:30],            # Wearable screen constraint
                "body": body[:80],              # Short glanceable text
                "action_type": action_type,     # info | warning | emergency | reminder
                "haptic": "medium" if action_type == "warning" else "light",
            }
        }
        logger.info(f"[WearableBridge] Sent to user {user_id}: '{title}'")
        # Production: push to WearOS/WatchKit via Firebase FCM or APNs
        return {"status": "sent", "payload": payload}

smartwatch_bridge = SmartWatchBridge()
