import json
import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)

class InMemoryCacheManager:
    """
    Redis-compatible cache interface backed by an in-process dict.
    Swap `_store` for aioredis in production with zero application code changes.
    """
    def __init__(self):
        self._store: dict[str, Any] = {}

    async def get(self, key: str) -> Optional[Any]:
        value = self._store.get(key)
        if value is not None:
            logger.debug(f"Cache HIT: {key}")
        return value

    async def set(self, key: str, value: Any, ttl_seconds: int = 300):
        self._store[key] = value
        logger.debug(f"Cache SET: {key} (TTL={ttl_seconds}s)")

    async def delete(self, key: str):
        self._store.pop(key, None)

    async def exists(self, key: str) -> bool:
        return key in self._store

    def make_key(self, *parts: str) -> str:
        return ":".join(parts)

cache = InMemoryCacheManager()
