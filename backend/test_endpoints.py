#!/usr/bin/env python
"""Test the FastAPI backend endpoints."""

import asyncio
import json
from starlette.testclient import TestClient
from main import app

def test_backend():
    client = TestClient(app)
    
    # Test health endpoint
    print("Testing /api/v1/health endpoint...")
    response = client.get("/api/v1/health")
    print(f"  Status: {response.status_code}")
    if response.status_code == 200:
        print(f"  Response: {response.json()}")
    
    # Test chat/ask endpoint
    print("\nTesting /api/v1/chat/ask endpoint...")
    payload = {
        "document_id": "test-doc",
        "query": "What is photosynthesis?",
        "level": "beginner"
    }
    response = client.post("/api/v1/chat/ask", json=payload)
    print(f"  Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"  Response keys: {list(data.keys())}")
        print(f"  Answer (first 80 chars): {data.get('answer', '')[:80]}...")
    else:
        print(f"  Error: {response.text}")
    
    # Test flashcards endpoint
    print("\nTesting /api/v1/flashcards/generate endpoint...")
    payload = {
        "source_text": "Photosynthesis is the process...",
        "count": 2
    }
    response = client.post("/api/v1/flashcards/generate", json=payload)
    print(f"  Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"  Response keys: {list(data.keys())}")
        print(f"  Cards returned: {len(data.get('cards', []))}")
    else:
        print(f"  Error: {response.text}")

if __name__ == "__main__":
    test_backend()
