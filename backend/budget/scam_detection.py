import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class ScamDetectionSystem:
    async def detect_scam(self, city: str, expense_desc: str, category: str, amount: float, pricing_analysis: dict) -> dict:
        """
        Detects potential travel scams using pricing anomalies and keyword heuristics.
        """
        desc = expense_desc.lower()
        warnings = []
        
        # Heuristic 1: Severe pricing anomaly
        if pricing_analysis["status"] == "tourist_trap" and pricing_analysis["markup_percentage"] > 200:
            warnings.append(f"Severe price inflation detected. You paid {pricing_analysis['markup_percentage']:.0f}% above average.")
            
        # Heuristic 2: Known scam keywords combined with high price
        scam_keywords = ["tourist fee", "special entry", "exclusive guide", "fast track", "premium taxi"]
        if any(keyword in desc for keyword in scam_keywords) and pricing_analysis["status"] in ["tourist_trap", "expensive"]:
            warnings.append("This charge matches patterns of known local tourist scams.")
            
        is_scam = len(warnings) > 0
        
        return {
            "is_suspicious": is_scam,
            "warnings": warnings,
            "advice": "Always agree on taxi fares before entering or use ride-sharing apps." if "taxi" in desc else "Check local pricing guides."
        }

scam_detector = ScamDetectionSystem()
