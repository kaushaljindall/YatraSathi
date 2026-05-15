import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class MobilityIntelligence:
    """
    Coordinates multimodal transport options and scores them for cost, speed,
    comfort, and environmental impact. Production: integrates Google Maps
    Directions API, Rome2Rio, or Mapbox Matrix API.
    """
    TRANSPORT_PROFILES = {
        "metro":    {"cost": 1, "speed": 3, "comfort": 2, "eco": 5},
        "taxi":     {"cost": 2, "speed": 4, "comfort": 4, "eco": 1},
        "bus":      {"cost": 5, "speed": 2, "comfort": 1, "eco": 4},
        "walk":     {"cost": 5, "speed": 1, "comfort": 3, "eco": 5},
        "auto":     {"cost": 3, "speed": 3, "comfort": 2, "eco": 3},
        "rideshare":{"cost": 2, "speed": 4, "comfort": 3, "eco": 2},
    }

    def score_options(self, distance_km: float, priority: str = "balanced") -> list[dict]:
        """Scores all transport options for a given trip leg."""
        weights = {
            "budget":   {"cost": 5, "speed": 1, "comfort": 1, "eco": 2},
            "fast":     {"cost": 1, "speed": 5, "comfort": 2, "eco": 1},
            "comfort":  {"cost": 1, "speed": 2, "comfort": 5, "eco": 1},
            "eco":      {"cost": 2, "speed": 1, "comfort": 1, "eco": 5},
            "balanced": {"cost": 2, "speed": 2, "comfort": 2, "eco": 2},
        }.get(priority, {"cost": 2, "speed": 2, "comfort": 2, "eco": 2})

        results = []
        for mode, profile in self.TRANSPORT_PROFILES.items():
            score = sum(profile[k] * weights[k] for k in weights)
            # Skip walking for distances > 3km
            if mode == "walk" and distance_km > 3:
                continue
            results.append({
                "mode": mode,
                "score": score,
                "estimated_minutes": int(distance_km / {"metro":0.5,"taxi":0.6,"bus":0.3,"walk":0.08,"auto":0.4,"rideshare":0.55}.get(mode,0.4)),
                "eco_friendly": profile["eco"] >= 4,
            })

        return sorted(results, key=lambda x: x["score"], reverse=True)

    def recommend_best(self, distance_km: float, priority: str = "balanced") -> dict:
        options = self.score_options(distance_km, priority)
        best = options[0] if options else {}
        return {
            "recommended_mode": best.get("mode"),
            "estimated_time_min": best.get("estimated_minutes"),
            "all_options": options,
        }

mobility_intelligence = MobilityIntelligence()
