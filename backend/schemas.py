from pydantic import BaseModel, HttpUrl, Field
from typing import Literal, List, Optional

# 1. The Input Model: What the user sends to start a test
class TestConfig(BaseModel):
    url: HttpUrl
    method: Literal["GET", "POST"] = "GET"
    
    # ge = greater than or equal to, le = less than or equal to
    request_count: int = Field(default=50, ge=1, le=1000)
    concurrency: int = Field(default=10, ge=1, le=50)

# 2. The Individual Request Result: One single HTTP call's outcome
class RequestResult(BaseModel):
    status_code: int
    response_time_ms: float
    timestamp: float
    error: Optional[str] = None  # Will be None if the request succeeds

# 3. The Batch Result: A chunk of results sent back from the Celery worker
class BatchResult(BaseModel):
    test_id: str
    batch_number: int
    results: List[RequestResult]
    is_complete: bool = False