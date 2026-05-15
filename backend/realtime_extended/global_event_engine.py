import logging
from monitoring.logging_engine import app_logger

logger = logging.getLogger(__name__)

class GlobalEventEngine:
    """
    Monitors global travel-impacting events and broadcasts them
    to the adaptive planning system. Production: subscribes to
    RSS feeds, GDACS disaster API, and airline disruption APIs.
    """
    ACTIVE_EVENTS = [
        {
            "id": "evt_001",
            "type": "festival",
            "location": "Jaipur",
            "country": "India",
            "name": "Jaipur Literature Festival",
            "impact": "high_crowd",
            "dates": "2026-01-23 to 2026-01-27",
        },
        {
            "id": "evt_002",
            "type": "disruption",
            "location": "Dubai",
            "country": "UAE",
            "name": "Airport Maintenance",
            "impact": "flight_delays",
            "dates": "2026-05-20",
        },
    ]

    async def get_events_for_city(self, city: str) -> list[dict]:
        matched = [e for e in self.ACTIVE_EVENTS if city.lower() in e["location"].lower()]
        app_logger.info("global_event_engine", city=city, events_found=len(matched))
        return matched

    async def check_disruption(self, city: str) -> bool:
        events = await self.get_events_for_city(city)
        return any(e["type"] == "disruption" for e in events)

global_event_engine = GlobalEventEngine()
