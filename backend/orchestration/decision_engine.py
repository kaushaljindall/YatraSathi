import logging
from realtime.weather_engine import weather_engine
from realtime.traffic_engine import traffic_engine
from realtime.crowd_engine import crowd_engine
from realtime.pricing_engine import pricing_engine
from realtime.event_engine import event_engine

logger = logging.getLogger(__name__)

class DecisionEngine:
    async def evaluate_current_plan(self, plan: dict) -> dict:
        """
        Aggregates all real-time signals to decide if the current itinerary is still viable.
        """
        logger.info("Evaluating itinerary viability against real-time signals...")
        
        # 1. Check Weather
        weather_data = await weather_engine.analyze_impact(plan["lat"], plan["lon"], plan["activity_type"])
        if weather_data["needs_reschedule"]:
            return {"status": "broken", "reason": "Weather conflict", "details": weather_data}
            
        # 2. Check Traffic
        traffic_data = await traffic_engine.optimize_route(plan["current_loc"], plan["next_loc"])
        if traffic_data["severe_delay"]:
            return {"status": "delayed", "reason": "Severe traffic", "details": traffic_data}
            
        # 3. Check Crowds
        crowd_data = await crowd_engine.predict_crowd(plan["next_loc"], plan["time"])
        if crowd_data["status"] == "overcrowded":
            return {"status": "warning", "reason": "Overcrowded", "details": crowd_data}
            
        return {"status": "viable", "reason": "All clear"}

decision_engine = DecisionEngine()
