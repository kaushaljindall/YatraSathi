import asyncio
import logging
from orchestration.ai_orchestrator import ai_orchestrator

logger = logging.getLogger(__name__)

class RealtimeScheduler:
    def __init__(self):
        self.is_running = False

    async def start_monitoring(self):
        """Background task that runs continuously to monitor active trips."""
        self.is_running = True
        logger.info("Real-Time Trip Monitoring Started...")
        
        while self.is_running:
            try:
                # In production: Fetch all ACTIVE trips happening right now from DB
                mock_active_trips = [
                    {"user_id": 1, "plan": {"lat": 26.9124, "lon": 75.7873, "activity_type": "park", "current_loc": "Hotel", "next_loc": "Hawa Mahal", "time": "14:00", "city": "Jaipur"}}
                ]
                
                for trip in mock_active_trips:
                    # Offload to orchestrator asynchronously
                    asyncio.create_task(
                        ai_orchestrator.process_live_itinerary(trip["user_id"], trip["plan"])
                    )
                    
            except Exception as e:
                logger.error(f"Scheduler error: {e}")
                
            # Wait 5 minutes before checking conditions again
            await asyncio.sleep(300)

scheduler = RealtimeScheduler()
