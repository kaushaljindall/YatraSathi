import time
from fastapi import Request
from monitoring.metrics import metrics
from monitoring.logging_engine import app_logger

async def performance_tracking_middleware(request: Request, call_next):
    """Middleware that tracks per-endpoint latency and request counts."""
    start = time.perf_counter()
    
    response = await call_next(request)
    
    duration_ms = (time.perf_counter() - start) * 1000
    endpoint = request.url.path
    
    metrics.increment("total_requests")
    metrics.record_latency(endpoint, duration_ms)

    if duration_ms > 3000:
        app_logger.warning("slow_request", endpoint=endpoint, duration_ms=round(duration_ms, 2))

    response.headers["X-Response-Time-Ms"] = str(round(duration_ms, 2))
    return response
