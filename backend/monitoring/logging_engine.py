import logging
import json
from datetime import datetime

class StructuredLogger:
    """
    Centralized structured logging engine.
    Outputs JSON-formatted logs compatible with Grafana Loki / Datadog.
    """
    def __init__(self, name: str):
        self._logger = logging.getLogger(name)
        if not self._logger.handlers:
            handler = logging.StreamHandler()
            handler.setFormatter(logging.Formatter("%(message)s"))
            self._logger.addHandler(handler)
            self._logger.setLevel(logging.INFO)

    def _emit(self, level: str, event: str, **kwargs):
        record = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": level,
            "event": event,
            **kwargs,
        }
        getattr(self._logger, level.lower())(json.dumps(record))

    def info(self, event: str, **kwargs):  self._emit("INFO", event, **kwargs)
    def warning(self, event: str, **kwargs): self._emit("WARNING", event, **kwargs)
    def error(self, event: str, **kwargs):  self._emit("ERROR", event, **kwargs)

app_logger = StructuredLogger("yatrasaathi")
