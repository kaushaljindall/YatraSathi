class CrowdEngine:
    async def predict_crowd(self, location: str, time_of_day: str) -> dict:
        """Predicts tourist congestion (Mocked logic for real-time ML inference)."""
        peak_hours = ["11:00", "14:00", "15:00", "18:00"]
        is_peak = time_of_day in peak_hours
        
        return {
            "location": location,
            "status": "overcrowded" if is_peak else "comfortable",
            "action": "Visit early morning to avoid 45m queues" if is_peak else "Good time to visit"
        }

crowd_engine = CrowdEngine()
