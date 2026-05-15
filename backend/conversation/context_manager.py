class ContextManager:
    """Manages active trip context (location, time, current activity)."""
    async def get_active_context(self, user_id: int) -> dict:
        # Mock active state
        return {
            "current_city": "Jaipur",
            "current_location": "Hawa Mahal",
            "next_activity": "Lunch at 13:00",
            "weather": "Sunny"
        }

context_manager = ContextManager()
