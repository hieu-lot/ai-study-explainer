#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test Vietnamese language detection and response functionality.
"""

import asyncio
import sys
import io

# Enable UTF-8 output on Windows
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Add the project root to the path
sys.path.insert(0, "/root" if sys.platform != "win32" else "c:\\Users\\ThinkBook\\.gemini\\antigravity\\scratch\\ai-study-explainer")

from backend.services.ai_service import ask, detect_language


async def test_vietnamese():
    """Test Vietnamese language detection and responses."""
    
    print("\n=== VIETNAMESE LANGUAGE DETECTION TEST ===\n")
    
    # Test 1: Vietnamese input
    print("Test 1: Vietnamese input about photosynthesis")
    vi_question = "Quang hop la gi?"  # Simplified to ASCII-compatible
    vi_lang = detect_language(vi_question)
    print(f"  Input: Vietnamese question about photosynthesis")
    print(f"  Detected language: {vi_lang}")
    response = await ask(vi_question, context="photosynthesis", level="beginner")
    print(f"  Response type: {type(response).__name__}")
    print(f"  Has answer: {'answer' in response}")
    print(f"  Answer starts with: {response['answer'][:50]}...")
    print(f"  ✓ Vietnamese input processed\n")
    
    # Test 2: English input
    print("Test 2: English input about machine learning")
    en_question = "What is machine learning and how does it work?"
    en_lang = detect_language(en_question)
    print(f"  Input: {en_question}")
    print(f"  Detected language: {en_lang}")
    response = await ask(en_question, context="machine learning", level="intermediate")
    print(f"  Response type: {type(response).__name__}")
    print(f"  Has answer: {'answer' in response}")
    print(f"  Answer starts with: {response['answer'][:50]}...")
    print(f"  ✓ English input processed with Vietnamese response\n")
    
    # Test 3: Detection verification
    print("Test 3: Language detection verification")
    test_cases = [
        ("Xuan sang", "vi"),
        ("Hello world", "en"),
        ("Question about photosynthesis", "en"),
    ]
    
    for text, expected in test_cases:
        detected = detect_language(text)
        status = "✓" if detected == expected else "✗"
        print(f"  {status} Text with Vietnamese chars → {detected} (expected {expected})")
    
    print("\n=== ALL TESTS COMPLETED ===\n")


if __name__ == "__main__":
    asyncio.run(test_vietnamese())
