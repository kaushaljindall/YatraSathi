import asyncio
import logging
from config.database import read_db
from orchestration.ai_orchestrator import ai_orchestrator

logger = logging.getLogger(__name__)


class RealtimeScheduler:
    def __init__(self):
        self.is_running = False

    async def start_monitoring(self):
        """
        Background task that continuously monitors all ACTIVE trips from the
        database and runs the AI orchestration pipeline for each one.
        """
        self.is_running = True
        logger.info("Real-Time Trip Monitoring Started — polling DB every 5 minutes.")

        while self.is_running:
            try:
                active_trips = await self._fetch_active_trips()

                if not active_trips:
                    logger.debug("No active trips to monitor right now.")
                else:
                    logger.info(f"Monitoring {len(active_trips)} active trip(s).")
                    for trip_entry in active_trips:
                        # Fire-and-forget — don't block the loop
                        asyncio.create_task(
                            ai_orchestrator.process_live_itinerary(
                                trip_entry["user_id"],
                                trip_entry["plan"]
                            )
                        )

            except Exception as e:
                logger.error(f"Scheduler error: {e}")

            # Poll every 5 minutes
            await asyncio.sleep(300)

    async def _fetch_active_trips(self) -> list:
        """
        Reads all trips from the database and returns only those that are
        currently active (today falls within their start and end date).
        """
        from datetime import date

        active = []
        try:
            db_data = await read_db()
            today = date.today()

            for trip in db_data.get("trips", []):
                try:
                    start = date.fromisoformat(trip["start_date"])
                    end = date.fromisoformat(trip["end_date"])
                    if start <= today <= end:
                        active.append({
                            "user_id": trip["user_id"],
                            "plan": {
                                "trip_id": trip["trip_id"],
                                "destination": trip.get("destination", ""),
                                "city": trip.get("destination", ""),
                                "activity_type": "general",
                                "current_loc": trip.get("destination", ""),
                                "next_loc": trip.get("destination", ""),
                                "time": "current",
                                "lat": trip.get("lat", 28.6139),  # Default to New Delhi
                                "lon": trip.get("lon", 77.2090),
                            }
                        })
                except (KeyError, ValueError):
                    continue

        except Exception as e:
            logger.error(f"Failed to fetch active trips from DB: {e}")

        return active


scheduler = RealtimeScheduler()
