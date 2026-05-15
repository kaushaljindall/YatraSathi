import asyncio
import logging
from typing import Callable, Any

logger = logging.getLogger(__name__)

class TaskQueue:
    """
    Lightweight in-process async task queue.
    Production: replace with Celery + Redis broker.
    """
    def __init__(self):
        self._queue: asyncio.Queue = asyncio.Queue()

    async def enqueue(self, task_fn: Callable, *args, **kwargs):
        await self._queue.put((task_fn, args, kwargs))
        logger.info(f"Task enqueued: {task_fn.__name__}")

    async def worker(self):
        """Background worker that processes queued tasks."""
        while True:
            task_fn, args, kwargs = await self._queue.get()
            try:
                logger.info(f"Executing task: {task_fn.__name__}")
                await task_fn(*args, **kwargs)
            except Exception as e:
                logger.error(f"Task failed [{task_fn.__name__}]: {e}")
            finally:
                self._queue.task_done()

task_queue = TaskQueue()
