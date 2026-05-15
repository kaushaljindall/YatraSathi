import logging
import time
from typing import Dict, Any
from datetime import datetime

logger = logging.getLogger(__name__)

class MetricsTracker:
    """In-process metrics store. Production: ships to Prometheus via prometheus_fastapi_instrumentator."""
    
    def __init__(self):
        self._counters: Dict[str, int] = {}
        self._latencies: Dict[str, list] = {}

    def increment(self, metric: str, value: int = 1):
        self._counters[metric] = self._counters.get(metric, 0) + value

    def record_latency(self, endpoint: str, duration_ms: float):
        if endpoint not in self._latencies:
            self._latencies[endpoint] = []
        self._latencies[endpoint].append(duration_ms)
        # Keep last 100 measurements
        self._latencies[endpoint] = self._latencies[endpoint][-100:]

    def get_summary(self) -> Dict[str, Any]:
        avg_latencies = {
            k: round(sum(v) / len(v), 2)
            for k, v in self._latencies.items() if v
        }
        return {
            "counters": self._counters,
            "avg_latency_ms": avg_latencies,
            "timestamp": datetime.utcnow().isoformat(),
        }

metrics = MetricsTracker()
