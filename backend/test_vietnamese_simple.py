#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test Vietnamese language detection and response functionality.
Writes results to a file to avoid console encoding issues.
"""

import asyncio
import sys
import json

# Add the project root to the path
sys.path.insert(0, "c:\\Users\\ThinkBook\\.gemini\\antigravity\\scratch\\ai-study-explainer")

from backend.services.ai_service import ask, detect_language


async def test_vietnamese():
    """Test Vietnamese language detection and responses."""
    
    results = []
    
    try:
        # Test 1: Vietnamese input
        print("Running Test 1...", flush=True)
        vi_question = "Quang hop"
        vi_lang = detect_language(vi_question)
        response = await ask(vi_question, context="photosynthesis", level="beginner")
        results.append({
            "test": "Vietnamese input",
            "language_detected": vi_lang,
            "has_response": bool(response),
            "fields": list(response.keys()),
            "answer_preview": response['answer'][:60] if 'answer' in response else "N/A"
        })
        
        # Test 2: English input
        print("Running Test 2...", flush=True)
        en_question = "What is machine learning?"
        en_lang = detect_language(en_question)
        response = await ask(en_question, context="machine learning", level="intermediate")
        results.append({
            "test": "English input",
            "language_detected": en_lang,
            "has_response": bool(response),
            "fields": list(response.keys()),
            "answer_preview": response['answer'][:60] if 'answer' in response else "N/A"
        })
        
        # Test 3: Detection
        print("Running Test 3...", flush=True)
        test_cases = [
            ("Xuan sang", "vi"),
            ("Hello world", "en"),
            ("Photosynthesis", "en"),
        ]
        
        detection_results = []
        for text, expected in test_cases:
            detected = detect_language(text)
            detection_results.append({
                "text": text,
                "detected": detected,
                "expected": expected,
                "correct": detected == expected
            })
        
        results.append({
            "test": "Language detection",
            "detections": detection_results
        })
        
        # Write results to file
        with open("test_results.json", "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print("Tests completed! Results written to test_results.json")
        print("Success: Tests ran without errors")
        
    except Exception as e:
        print(f"Error: {type(e).__name__}: {str(e)}")
        raise


if __name__ == "__main__":
    asyncio.run(test_vietnamese())
