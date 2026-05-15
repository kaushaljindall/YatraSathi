from services.traffic_service import traffic_service

class TrafficEngine:
    async def optimize_route(self, origin: str, destination: str) -> dict:
        """Determines if traffic is too heavy and suggests delay or rerouting."""
        traffic = await traffic_service.get_live_traffic(origin, destination)
        
        severe_delay = traffic["delay_minutes"] > 20
        
        return {
            "traffic": traffic,
            "severe_delay": severe_delay,
            "action": "Delay departure by 30 mins or use metro" if severe_delay else "Route clear"
        }

traffic_engine = TrafficEngine()
