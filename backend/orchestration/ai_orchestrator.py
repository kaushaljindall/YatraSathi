import logging
import asyncio
from orchestration.decision_engine import decision_engine
from orchestration.adaptive_planner import adaptive_planner
from realtime.notification_engine import notification_engine

logger = logging.getLogger(__name__)

class AIOrchestrator:
    async def process_live_itinerary(self, user_id: int, current_plan: dict):
        """
        The core brain. Constantly evaluates the current plan and triggers AI adaptations if needed.
        """
        logger.info(f"Orchestrating live itinerary for user {user_id}")
        
        # 1. Evaluate viability
        evaluation = await decision_engine.evaluate_current_plan(current_plan)
        
        # 2. Handle broken plans
        if evaluation["status"] == "broken":
            await notification_engine.push_alert(
                user_id, "alert", f"Plan disrupted: {evaluation['reason']}", evaluation
            )
            
            # 3. Generate alternative
            alternative = await adaptive_planner.generate_alternative(current_plan, evaluation["reason"])
            
            await notification_engine.push_alert(
                user_id, "update", "AI has updated your itinerary.", {"new_plan": alternative}
            )
            return alternative
            
        elif evaluation["status"] == "delayed":
            await notification_engine.push_alert(
                user_id, "warning", f"Traffic Delay: {evaluation['details']['traffic']['delay_minutes']} mins.", evaluation
            )
            
        return current_plan

ai_orchestrator = AIOrchestrator()
