import redis.asyncio as redis
import os
import logging

logger = logging.getLogger(__name__)

class RedisManager:
    def __init__(self):
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.client = None

    async def connect(self):
        if not self.client:
            self.client = redis.from_url(self.redis_url, decode_responses=True)
            try:
                await self.client.ping()
                logger.info("Connected to Redis successfully.")
            except Exception as e:
                logger.error(f"Redis connection failed: {e}")

    async def disconnect(self):
        if self.client:
            await self.client.close()

    async def cache_set(self, key: str, value: str, ttl: int = 3600):
        if self.client:
            await self.client.set(key, value, ex=ttl)

    async def cache_get(self, key: str):
        if self.client:
            return await self.client.get(key)
        return None

    # Pub/Sub functionality
    async def publish(self, channel: str, message: str):
        if self.client:
            await self.client.publish(channel, message)

redis_client = RedisManager()
