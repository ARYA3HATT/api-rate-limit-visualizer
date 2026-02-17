import json
import time
import asyncio
import httpx
import redis
from celery import Celery
from config import settings

# 1. Initialize Celery and Redis clients
celery_app = Celery(
    "tasks",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

# decode_responses=True ensures we get normal Python strings back, not raw bytes
redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)


async def fire_single_request(client: httpx.AsyncClient, method: str, url: str) -> dict:
    """Fires a single HTTP request, measures time, and catches any errors."""
    start_time = time.time()

    result = {
        "status_code": 0,
        "response_time_ms": 0.0,
        "timestamp": start_time,
        "error": None,
        "rate_limit_headers": {}
    }

    try:
        response = await client.request(method, url)
        result["status_code"] = response.status_code

        headers = response.headers
        result["rate_limit_headers"] = {
            "Retry-After": headers.get("Retry-After"),
            "X-RateLimit-Limit": headers.get("X-RateLimit-Limit"),
            "X-RateLimit-Remaining": headers.get("X-RateLimit-Remaining")
        }

    except Exception as e:
        result["error"] = str(e)

    end_time = time.time()
    result["response_time_ms"] = round((end_time - start_time) * 1000, 2)

    return result


async def process_load_test(test_id: str, url: str, method: str, request_count: int, concurrency: int):
    """Handles the batching and async coordination of the load test."""

    # One AsyncClient for the whole test — reuses connection pools for efficiency
    async with httpx.AsyncClient(timeout=10.0) as client:
        requests_left = request_count
        batch_number = 1

        while requests_left > 0:
            # How many requests in this batch
            current_batch_size = min(requests_left, concurrency)

            # Build list of tasks — not running yet, just queuing
            tasks = [
                fire_single_request(client, method, url)
                for _ in range(current_batch_size)
            ]

            # Fire all tasks simultaneously, wait for all to finish
            batch_results = await asyncio.gather(*tasks)

            batch_payload = {
                "test_id": test_id,
                "batch_number": batch_number,
                "results": list(batch_results),
                "is_complete": False
            }

            # Push batch into Redis list
            redis_client.rpush(f"test:{test_id}:results", json.dumps(batch_payload))

            requests_left -= current_batch_size
            batch_number += 1


@celery_app.task(name="tasks.run_load_test")
def run_load_test(test_id: str, url: str, method: str, request_count: int, concurrency: int):
    """
    Main Celery entry point.
    Celery is synchronous — asyncio.run() bridges it to our async logic.
    """
    asyncio.run(process_load_test(test_id, url, method, request_count, concurrency))

    # Signal to FastAPI that the test is fully complete
    redis_client.set(f"test:{test_id}:complete", "true")

    return {"status": "success", "test_id": test_id}
