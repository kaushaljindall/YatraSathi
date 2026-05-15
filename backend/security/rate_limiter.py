import time
from collections import defaultdict
from fastapi import Request, HTTPException

class InMemoryRateLimiter:
    """
    Token-bucket style rate limiter. Production: backed by Redis INCR + EXPIRE.
    """
    def __init__(self, requests_per_minute: int = 60):
        self.rpm = requests_per_minute
        self._buckets: dict[str, list] = defaultdict(list)

    async def check(self, request: Request):
        client_ip = request.client.host
        now = time.time()
        window = 60  # seconds

        # Evict timestamps older than the window
        self._buckets[client_ip] = [
            t for t in self._buckets[client_ip] if now - t < window
        ]

        if len(self._buckets[client_ip]) >= self.rpm:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please slow down your requests.",
                headers={"Retry-After": "60"},
            )

        self._buckets[client_ip].append(now)

# Default limiter: 60 req/min per IP
rate_limiter = InMemoryRateLimiter(requests_per_minute=60)
# Stricter limiter for AI endpoints: 20 req/min
ai_rate_limiter = InMemoryRateLimiter(requests_per_minute=20)
