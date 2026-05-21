import hashlib
import json

# Fast in-memory cache to replace Redis completely
_memory_cache = {}

async def generate_cache_key(prefix: str, **kwargs) -> str:
    """
    Generates a hash-based cache key based on a prefix and keyword arguments.
    """
    key_string = json.dumps(kwargs, sort_keys=True)
    hash_object = hashlib.md5(key_string.encode())
    return f"{prefix}:{hash_object.hexdigest()}"

async def get_cache(key: str):
    """Retrieve value from in-memory cache."""
    return _memory_cache.get(key)

async def set_cache(key: str, value: str, ttl: int = 86400):
    """Set value in in-memory cache."""
    _memory_cache[key] = value
