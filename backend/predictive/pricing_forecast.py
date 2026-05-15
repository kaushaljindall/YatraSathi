import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class PricingForecaster:
    """Predicts hotel/transport price surges based on event and seasonal patterns."""

    EVENT_SURGE_MONTHS = {1: 0.05, 3: 0.10, 10: 0.15, 12: 0.25}  # month -> multiplier

    def forecast(self, category: str, base_price: float, days_ahead: int = 1) -> dict:
        month = datetime.utcnow().month
        seasonal_surge = self.EVENT_SURGE_MONTHS.get(month, 0.0)
        # Weekend surge heuristic
        weekend_surge = 0.12 if datetime.utcnow().weekday() >= 4 else 0.0

        total_multiplier = 1 + seasonal_surge + weekend_surge
        forecasted_price = round(base_price * total_multiplier, 2)
        change_pct = round((total_multiplier - 1) * 100, 1)

        return {
            "category": category,
            "current_price": base_price,
            "forecasted_price": forecasted_price,
            "change_percent": change_pct,
            "forecast_days": days_ahead,
            "alert": change_pct > 15,
            "message": (
                f"⚠ {category.capitalize()} prices may rise {change_pct}% in the next {days_ahead} day(s)."
                if change_pct > 15 else f"{category.capitalize()} prices are stable."
            ),
        }

pricing_forecaster = PricingForecaster()
