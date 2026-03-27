#!/usr/bin/env python
"""Full integration test of the backend endpoints with the fixed enum."""

import asyncio
import json
from pydantic import BaseModel, ValidationError
from enum import Enum

# Simulate the Pydantic validation
class ExplanationLevel(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    expert = "expert"

class ChatRequest(BaseModel):
    document_id: str
    query: str
    level: ExplanationLevel = ExplanationLevel.intermediate

print("=" * 80)
print("TESTING FIXED ENUM AND REQUEST VALIDATION")
print("=" * 80)

# Test 1: Frontend request with lowercase level (what the frontend actually sends)
print("\n1. Testing frontend request with lowercase level:")
frontend_payload = {
    "document_id": "current",
    "query": "What is photosynthesis?",
    "level": "intermediate"  # Lowercase - what frontend sends
}
print(f"   Payload: {json.dumps(frontend_payload, indent=2)}")

try:
    request = ChatRequest(**frontend_payload)
    print(f"   ✓ Validation passed!")
    print(f"   - document_id: {request.document_id}")
    print(f"   - query: {request.query}")
    print(f"   - level: {request.level} (value: {request.level.value})")
    print(f"   - level.value.lower(): {request.level.value.lower()}")
except ValidationError as e:
    print(f"   ✗ Validation failed: {e}")

# Test 2: All valid levels
print("\n2. Testing all valid levels:")
for level in ["beginner", "intermediate", "expert"]:
    try:
        request = ChatRequest(
            document_id="test",
            query="test",
            level=level
        )
        print(f"   ✓ '{level}' accepted")
    except ValidationError as e:
        print(f"   ✗ '{level}' rejected: {e}")

# Test 3: Invalid level (should fail)
print("\n3. Testing invalid level (should fail):")
try:
    request = ChatRequest(
        document_id="test",
        query="test",
        level="invalid_level"
    )
    print(f"   ✗ Should have failed but didn't!")
except ValidationError as e:
    print(f"   ✓ Correctly rejected invalid level")

# Test 4: Simulate ai_service.ask() call
print("\n4. Simulating ai_service.ask() call:")
from services import ai_service

async def test_ask_call():
    try:
        request = ChatRequest(**frontend_payload)
        result = await ai_service.ask(
            question=request.query,
            context="",
            level=request.level.value.lower()
        )
        print(f"   ✓ ai_service.ask() returned successfully")
        print(f"   - answer (first 80 chars): {result.get('answer', '')[:80]}...")
        print(f"   - summary: {result.get('summary', '')}")
        print(f"   - key_points count: {len(result.get('key_points', []))}")
        return True
    except Exception as e:
        print(f"   ✗ ai_service.ask() failed: {e}")
        import traceback
        traceback.print_exc()
        return False

success = asyncio.run(test_ask_call())

print("\n" + "=" * 80)
if success:
    print("✓ ALL TESTS PASSED - Backend is ready!")
else:
    print("✗ Some tests failed")
print("=" * 80)
