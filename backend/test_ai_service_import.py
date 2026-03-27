#!/usr/bin/env python
"""Test ai_service import and functionality."""

import asyncio
import sys

try:
    from services import ai_service
    print("✓ Import successful")
    print(f"  - ask function exists: {hasattr(ai_service, 'ask')}")
    print(f"  - generate_flashcards function exists: {hasattr(ai_service, 'generate_flashcards')}")
    
    # Test ask function
    async def test_ask():
        try:
            result = await ai_service.ask(
                question="What is photosynthesis?",
                context="photosynthesis",
                level="beginner"
            )
            print("\n✓ ask() works correctly")
            print(f"  - answer (first 50 chars): {result.get('answer', '')[:50]}...")
            print(f"  - has summary: {'summary' in result}")
            print(f"  - has key_points: {'key_points' in result}")
            return True
        except Exception as e:
            print(f"✗ ask() failed: {e}")
            return False
    
    # Test generate_flashcards function
    async def test_generate_flashcards():
        try:
            result = await ai_service.generate_flashcards(
                source_text="Photosynthesis is important",
                count=2
            )
            print("\n✓ generate_flashcards() works correctly")
            print(f"  - returned {len(result)} cards")
            print(f"  - first card has question: {'question' in result[0] or 'front' in result[0]}")
            return True
        except Exception as e:
            print(f"✗ generate_flashcards() failed: {e}")
            return False
    
    # Run async tests
    async def run_tests():
        ask_ok = await test_ask()
        flash_ok = await test_generate_flashcards()
        return ask_ok and flash_ok
    
    success = asyncio.run(run_tests())
    sys.exit(0 if success else 1)
    
except ImportError as e:
    print(f"✗ Import failed: {e}")
    sys.exit(1)
except Exception as e:
    print(f"✗ Unexpected error: {e}")
    sys.exit(1)
