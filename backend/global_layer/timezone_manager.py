from datetime import datetime
import pytz
import logging

logger = logging.getLogger(__name__)

class TimezoneManager:
    """Converts travel times across timezones for seamless international trip planning."""

    def convert(self, naive_utc_time: datetime, target_timezone: str) -> dict:
        try:
            tz = pytz.timezone(target_timezone)
            localized = pytz.utc.localize(naive_utc_time).astimezone(tz)
            return {
                "utc_time": naive_utc_time.isoformat(),
                "local_time": localized.strftime("%Y-%m-%d %H:%M %Z"),
                "timezone": target_timezone,
                "utc_offset": str(localized.utcoffset()),
            }
        except Exception as e:
            logger.error(f"Timezone conversion error: {e}")
            return {"error": str(e)}

    def get_city_timezone(self, city: str) -> str:
        timezone_map = {
            "delhi": "Asia/Kolkata", "jaipur": "Asia/Kolkata",
            "dubai": "Asia/Dubai", "london": "Europe/London",
            "new york": "America/New_York", "tokyo": "Asia/Tokyo",
            "paris": "Europe/Paris",
        }
        return timezone_map.get(city.lower(), "UTC")

timezone_manager = TimezoneManager()
