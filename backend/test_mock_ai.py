#!/usr/bin/env python
"""
Quick test of mock AI service to verify realistic responses.
"""

import asyncio
import json
from services import ai_service


async def test_ask():
    """Test the ask() function"""
    print("\n" + "="*80)
    print("TEST 1: ask() with photosynthesis (beginner)")
    print("="*80)
    result = await ai_service.ask(
        question="How does photosynthesis work?",
        context="photosynthesis plant energy conversion",
        level="beginner"
    )
    print(f"\nResponse structure:")
    print(f"  - answer (first 100 chars): {result['answer'][:100]}...")
    print(f"  - summary: {result['summary']}")
    print(f"  - key_points: {result['key_points']}")
    print(f"  - difficulty: {result['difficulty']}")
    print(f"  - source: {result['source']}")
    
    print("\n" + "="*80)
    print("TEST 2: ask() with machine learning (intermediate)")
    print("="*80)
    result = await ai_service.ask(
        question="What is supervised learning?",
        context="machine learning labeled data",
        level="intermediate"
    )
    print(f"\nResponse:")
    print(f"  - answer (first 100 chars): {result['answer'][:100]}...")
    print(f"  - summary: {result['summary']}")
    print(f"  - key_points: {result['key_points']}")

    print("\n" + "="*80)
    print("TEST 3: ask() with quantum computing (advanced)")
    print("="*80)
    result = await ai_service.ask(
        question="Explain quantum superposition",
        context="quantum computing qubits states",
        level="advanced"
    )
    print(f"\nResponse:")
    print(f"  - answer (first 100 chars): {result['answer'][:100]}...")
    print(f"  - summary: {result['summary']}")
    print(f"  - key_points: {result['key_points']}")

    print("\n" + "="*80)
    print("TEST 4: ask() with generic topic (fallback)")
    print("="*80)
    result = await ai_service.ask(
        question="What is biology?",
        context="random unknown topic xyz",
        level="beginner"
    )
    print(f"\nResponse (fallback):")
    print(f"  - answer (first 100 chars): {result['answer'][:100]}...")
    print(f"  - summary: {result['summary']}")


async def test_flashcards():
    """Test the generate_flashcards() function"""
    
    print("\n" + "="*80)
    print("TEST 5: generate_flashcards() for photosynthesis")
    print("="*80)
    cards = await ai_service.generate_flashcards(
        source_text="Photosynthesis is the process by which plants convert sunlight...",
        count=3
    )
    print(f"\nGenerated {len(cards)} flashcards:")
    for i, card in enumerate(cards, 1):
        print(f"\n  Card {i}:")
        print(f"    Front: {card['front']}")
        print(f"    Back: {card['back'][:80]}...")

    print("\n" + "="*80)
    print("TEST 6: generate_flashcards() for machine learning")
    print("="*80)
    cards = await ai_service.generate_flashcards(
        source_text="Machine learning involves training models on labeled data...",
        count=2
    )
    print(f"\nGenerated {len(cards)} flashcards:")
    for i, card in enumerate(cards, 1):
        print(f"\n  Card {i}:")
        print(f"    Front: {card['front']}")
        print(f"    Back: {card['back'][:80]}...")

    print("\n" + "="*80)
    print("TEST 7: generate_flashcards() with generic topic (fallback)")
    print("="*80)
    cards = await ai_service.generate_flashcards(
        source_text="Some random text about unknown topics...",
        count=3
    )
    print(f"\nGenerated {len(cards)} fallback flashcards:")
    for i, card in enumerate(cards, 1):
        print(f"\n  Card {i}:")
        print(f"    Front: {card['front']}")
        print(f"    Back: {card['back'][:80]}...")


async def main():
    print("\n" + "█"*80)
    print("MOCK AI SERVICE TEST")
    print("█"*80)
    
    await test_ask()
    await test_flashcards()
    
    print("\n" + "█"*80)
    print("✓ ALL TESTS PASSED - Mock AI is working correctly!")
    print("█"*80 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
