import logging

logger = logging.getLogger(__name__)

REGIONAL_PROFILES = {
    "india": {
        "currency": "INR",
        "greeting": "Namaste",
        "tipping_culture": "optional",
        "bargaining": "expected",
        "scam_hotspots": ["tourist tuk-tuks", "gem shop scams", "fake guides"],
        "emergency": "100 (Police) | 108 (Ambulance)",
    },
    "japan": {
        "currency": "JPY",
        "greeting": "Konnichiwa",
        "tipping_culture": "offensive — do NOT tip",
        "bargaining": "never appropriate",
        "scam_hotspots": ["inflated tourist restaurants in Shinjuku"],
        "emergency": "110 (Police) | 119 (Fire/Ambulance)",
    },
    "france": {
        "currency": "EUR",
        "greeting": "Bonjour",
        "tipping_culture": "appreciated (5–10%)",
        "bargaining": "not typical",
        "scam_hotspots": ["petition scams near Eiffel Tower", "friendship bracelet scams"],
        "emergency": "17 (Police) | 15 (Medical)",
    },
}

class RegionalAdaptation:
    def get_profile(self, country: str) -> dict:
        return REGIONAL_PROFILES.get(country.lower(), {"note": "Regional profile not yet available."})

    def get_cultural_tip(self, country: str) -> str:
        profile = self.get_profile(country)
        return (
            f"In {country.title()}: tipping is '{profile.get('tipping_culture', 'unknown')}', "
            f"bargaining is '{profile.get('bargaining', 'unknown')}'."
        )

regional_adaptation = RegionalAdaptation()
