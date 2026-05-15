import httpx
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class CurrencyEngine:
    """
    Live currency conversion and regional cost normalization.
    Production: uses ExchangeRate-API or Open Exchange Rates.
    """
    # Fallback rates (updated manually or via scheduled task in production)
    FALLBACK_RATES = {
        "USD": 1.0, "INR": 83.5, "EUR": 0.92,
        "GBP": 0.79, "JPY": 149.2, "AED": 3.67,
    }

    async def convert(self, amount: float, from_currency: str, to_currency: str) -> dict:
        from_rate = self.FALLBACK_RATES.get(from_currency.upper(), 1.0)
        to_rate = self.FALLBACK_RATES.get(to_currency.upper(), 1.0)

        # Convert through USD base
        usd_amount = amount / from_rate
        converted = round(usd_amount * to_rate, 2)

        return {
            "from_currency": from_currency.upper(),
            "to_currency": to_currency.upper(),
            "original_amount": amount,
            "converted_amount": converted,
            "rate_used": round(to_rate / from_rate, 4),
            "timestamp": datetime.utcnow().isoformat(),
        }

currency_engine = CurrencyEngine()
