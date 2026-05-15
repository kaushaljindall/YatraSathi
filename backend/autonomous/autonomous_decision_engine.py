import logging
from autonomous.autonomous_planner import autonomous_planner
from autonomous.workflow_engine import workflow_engine

logger = logging.getLogger(__name__)

class AutonomousDecisionEngine:
    """
    Evaluates real-time signals and decides which autonomous workflows to trigger.
    Safety-first: all decisions are surfaced to users before execution.
    """
    async def evaluate_and_act(self, user_id: int, trip: dict, signals: dict) -> list[dict]:
        actions = []

        # Rule 1: Weather disruption
        weather_status = signals.get("weather", {}).get("status", "clear")
        if weather_status in ["rain", "storm"]:
            result = await workflow_engine.trigger("weather_disruption", {"trip": trip})
            actions.append({"type": "weather_disruption", "action": result})

        # Rule 2: Budget critical
        burn_status = signals.get("budget", {}).get("status", "healthy")
        if burn_status == "critical":
            result = await workflow_engine.trigger("budget_critical", {"trip": trip})
            actions.append({"type": "budget_critical", "action": result})

        # Rule 3: Crowd surge
        crowd_status = signals.get("crowd", {}).get("status", "comfortable")
        if crowd_status == "overcrowded":
            result = await workflow_engine.trigger("crowd_surge", {"trip": trip})
            actions.append({"type": "crowd_surge", "action": result})

        logger.info(f"[AutonomousDecisionEngine] {len(actions)} action(s) triggered for user {user_id}")
        return actions

autonomous_decision_engine = AutonomousDecisionEngine()
