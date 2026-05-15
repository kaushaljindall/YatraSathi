import logging
from predictive.crowd_prediction import crowd_predictor
from predictive.pricing_forecast import pricing_forecaster
from predictive.weather_prediction import weather_predictor

logger = logging.getLogger(__name__)

class PredictiveCore:
    """
    Unified predictive engine that aggregates all signal forecasts
    into a single actionable risk assessment for any travel moment.
    """

    async def full_risk_assessment(self, city: str, hour: int, month: int, budget: float) -> dict:
        """
        Combines weather, crowd, and pricing forecasts into one holistic risk score.
        Risk score: 0 (perfect) → 100 (do not travel now).
        """
        risk_score = 0
        signals = {}
        recommendations = []

        # 1. Weather risk
        weather = await weather_predictor.forecast_risk(city, days_ahead=1)
        signals["weather"] = weather
        rain_prob = weather.get("rain_probability", 0)
        if rain_prob > 0.6:
            risk_score += 35
            recommendations.append(weather["advice"])
        elif rain_prob > 0.3:
            risk_score += 15

        # 2. Crowd risk
        crowd = crowd_predictor.predict(city, hour, month)
        signals["crowd"] = crowd
        if crowd["crowd_score"] >= 7:
            risk_score += 30
            recommendations.append(crowd["advice"])
        elif crowd["crowd_score"] >= 5:
            risk_score += 10

        # 3. Pricing risk (accommodation example)
        pricing = pricing_forecaster.forecast("accommodation", budget * 0.4)
        signals["pricing"] = pricing
        if pricing["alert"]:
            risk_score += 20
            recommendations.append(pricing["message"])

        risk_level = "low" if risk_score < 25 else "moderate" if risk_score < 55 else "high"

        return {
            "city": city,
            "risk_score": min(risk_score, 100),
            "risk_level": risk_level,
            "signals": signals,
            "recommendations": recommendations,
        }

predictive_core = PredictiveCore()
