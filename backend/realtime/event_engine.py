from services.event_service import event_service

class EventEngine:
    async def analyze_events(self, city: str, date: str) -> dict:
        """Determines if local events impact the user's trip positively or negatively."""
        events = await event_service.get_local_events(city, date)
        
        # If there's a huge event, it might cause traffic/crowds, or be a cool thing to attend.
        has_major_event = len(events) > 0
        
        return {
            "events": events,
            "has_major_event": has_major_event,
            "impact": "Expect heavy crowds downtown." if has_major_event else "Normal conditions."
        }

event_engine = EventEngine()
