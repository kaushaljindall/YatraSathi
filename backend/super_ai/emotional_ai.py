import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class EmotionalAI:
    """
    Detects travel stress from user language patterns and adapts
    the AI's tone, pacing, and response style accordingly.
    """

    STRESS_SIGNALS = {
        "critical": ["missed flight", "emergency", "stolen", "lost passport", "hospital", "accident"],
        "high":     ["delayed", "late", "missed", "stuck", "cancelled", "lost", "help"],
        "moderate": ["worried", "confused", "tired", "expensive", "crowded", "rush"],
    }

    TONE_MAP = {
        "critical":  {"tone": "calm_emergency",  "pacing": "slow", "emojis": False},
        "high":      {"tone": "reassuring",       "pacing": "measured", "emojis": False},
        "moderate":  {"tone": "supportive",       "pacing": "normal", "emojis": True},
        "relaxed":   {"tone": "friendly",         "pacing": "casual", "emojis": True},
    }

    def analyze_stress(self, user_text: str) -> Dict[str, Any]:
        text_lower = user_text.lower()

        for level, keywords in self.STRESS_SIGNALS.items():
            if any(kw in text_lower for kw in keywords):
                tone_config = self.TONE_MAP[level]
                return {
                    "stress_level": level,
                    "tone": tone_config["tone"],
                    "pacing": tone_config["pacing"],
                    "system_note": self._build_system_note(level),
                }

        return {"stress_level": "relaxed", **self.TONE_MAP["relaxed"], "system_note": ""}

    def _build_system_note(self, level: str) -> str:
        notes = {
            "critical": (
                "CRITICAL: The user is in a travel emergency. Respond with calm authority. "
                "Provide step-by-step actionable guidance. Prioritize safety. No jokes."
            ),
            "high": (
                "The user is stressed or experiencing disruption. Be warm, reassuring, "
                "and solution-focused. Keep responses concise."
            ),
            "moderate": (
                "The user seems slightly anxious or fatigued. Be supportive, proactive, "
                "and offer helpful alternatives."
            ),
        }
        return notes.get(level, "")

emotional_ai = EmotionalAI()
