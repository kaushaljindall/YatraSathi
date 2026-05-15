from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class CrowdPredictor:
    """Predicts tourist congestion using time-of-day heuristics + historical patterns."""

    PEAK_WINDOWS = {
        "morning_rush": (9, 11),
        "afternoon_rush": (13, 16),
        "evening_rush": (17, 19),
    }

    def predict(self, location: str, hour: int, month: int) -> dict:
        # Peak season detection (summer + holiday months)
        is_peak_season = month in [3, 4, 10, 11, 12]
        
        crowd_score = 3  # baseline 1-10
        for window, (start, end) in self.PEAK_WINDOWS.items():
            if start <= hour <= end:
                crowd_score += 4
                break
        if is_peak_season:
            crowd_score += 2

        crowd_score = min(crowd_score, 10)
        
        if crowd_score >= 7:
            status, advice = "crowded", f"Arrive before {self.PEAK_WINDOWS['morning_rush'][0]}:00 AM to beat the rush."
        elif crowd_score >= 5:
            status, advice = "moderate", "Expect some queues. Budget 20 extra minutes."
        else:
            status, advice = "quiet", "Great time to visit! Low crowds expected."

        return {
            "location": location,
            "hour": hour,
            "crowd_score": crowd_score,
            "status": status,
            "is_peak_season": is_peak_season,
            "advice": advice,
        }

crowd_predictor = CrowdPredictor()
