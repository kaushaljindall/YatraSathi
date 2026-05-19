import hashlib
import json
import os
import redis.asyncio as redis

# Using environment variables or fallback to default
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
try:
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
except Exception as e:
    redis_client = None
    print(f"Failed to connect to Redis: {e}")

async def generate_cache_key(prefix: str, **kwargs) -> str:
    """
    Generates a hash-based cache key based on a prefix and keyword arguments.
    For example: prefix='tts', text='hello', lang='en', voice='en-US-AriaNeural'
    """
    key_string = json.dumps(kwargs, sort_keys=True)
    hash_object = hashlib.md5(key_string.encode())
    return f"{prefix}:{hash_object.hexdigest()}"

async def get_cache(key: str):
    """Retrieve value from cache."""
    if not redis_client: return None
    return await redis_client.get(key)

async def set_cache(key: str, value: str, ttl: int = 86400):
    """Set value in cache with expiration."""
    if not redis_client: return
    await redis_client.set(key, value, ex=ttl)
