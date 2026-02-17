import uuid
import json
import asyncio
import redis
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from schemas import TestConfig
from tasks import run_load_test

# 1. App Setup
app = FastAPI(title="API Rate Limit Visualizer")

# Add CORS Middleware to allow your React app to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to Redis
redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)

# 2. REST Endpoint: Start the Load Test
@app.post("/api/run-test")
async def start_load_test(config: TestConfig):
    test_id = str(uuid.uuid4())

    run_load_test.delay(
        test_id=test_id,
        url=str(config.url),
        method=config.method,
        request_count=config.request_count,
        concurrency=config.concurrency
    )

    return {
        "test_id": test_id,
        "status": "started",
        "message": "Load test queued successfully."
    }

# 3. WebSocket Endpoint: Stream live results
@app.websocket("/ws/{test_id}")
async def websocket_endpoint(websocket: WebSocket, test_id: str):
    await websocket.accept()
    last_index = 0

    try:
        while True:
            current_length = redis_client.llen(f"test:{test_id}:results")

            if current_length > last_index:
                new_batches = redis_client.lrange(
                    f"test:{test_id}:results", last_index, current_length - 1
                )
                for batch_json in new_batches:
                    await websocket.send_text(batch_json)
                last_index = current_length

            is_complete = redis_client.get(f"test:{test_id}:complete")
            if is_complete == "true":
                # Final check — catch any last-millisecond results
                final_length = redis_client.llen(f"test:{test_id}:results")
                if final_length > last_index:
                    missed_batches = redis_client.lrange(
                        f"test:{test_id}:results", last_index, final_length - 1
                    )
                    for batch_json in missed_batches:
                        await websocket.send_text(batch_json)

                await websocket.send_json({"type": "TEST_COMPLETE", "test_id": test_id})
                break

            await asyncio.sleep(0.5)

    except WebSocketDisconnect:
        print(f"Client disconnected from test: {test_id}")
    finally:
        if websocket.client_state.name != "DISCONNECTED":
            await websocket.close()

# 4. REST Endpoint: Fetch the Final Summary
@app.get("/api/test/{test_id}/summary")
async def get_test_summary(test_id: str):
    all_batches_json = redis_client.lrange(f"test:{test_id}:results", 0, -1)

    if not all_batches_json:
        return {"error": "Test not found or no results generated."}

    all_results = []
    for batch_str in all_batches_json:
        batch_data = json.loads(batch_str)
        all_results.extend(batch_data.get("results", []))

    total_requests = len(all_results)
    success_count = sum(1 for r in all_results if 200 <= r.get("status_code", 0) < 300)
    error_count = sum(1 for r in all_results if r.get("error") is not None or r.get("status_code", 0) >= 400)
    rate_limit_hits = sum(1 for r in all_results if r.get("status_code") == 429)

    response_times = sorted([
        r.get("response_time_ms", 0.0)
        for r in all_results
        if r.get("response_time_ms") is not None
    ])

    def get_percentile(sorted_list, percentile):
        if not sorted_list:
            return 0.0
        idx = int(len(sorted_list) * percentile)
        return sorted_list[min(idx, len(sorted_list) - 1)]

    summary = {
        "total_requests": total_requests,
        "success_count": success_count,
        "error_count": error_count,
        "rate_limit_hits": rate_limit_hits,
        "response_times": {
            "min": response_times[0] if response_times else 0.0,
            "max": response_times[-1] if response_times else 0.0,
            "avg": round(sum(response_times) / len(response_times), 2) if response_times else 0.0,
            "p50": get_percentile(response_times, 0.50),
            "p95": get_percentile(response_times, 0.95),
            "p99": get_percentile(response_times, 0.99),
        }
    }

    return summary
