#!/usr/bin/env python3
"""
Test script for OpenAI Document Q&A functionality
Demonstrates: File upload, text extraction, and document-based Q&A
"""

import os
import json
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from services.file_service import extract_text, is_supported_file
from services.openai_service import ask_with_context


def create_sample_document():
    """Create a sample TXT document for testing"""
    sample_txt = """
    PHOTOSYNTHESIS: CONVERTING SUNLIGHT INTO ENERGY
    
    Photosynthesis is the process by which plants convert light energy from the sun into 
    chemical energy stored in glucose. This process occurs in two main stages:
    
    1. Light-Dependent Reactions
    - Take place in the thylakoid membrane of chloroplasts
    - Absorb photons and excite electrons
    - Produce ATP and NADPH
    - Release oxygen as a byproduct
    
    2. Light-Independent Reactions (Calvin Cycle)
    - Occurs in the stroma of chloroplasts
    - Uses ATP and NADPH from light reactions
    - Fixes CO2 from the atmosphere
    - Produces glucose
    
    IMPORTANCE
    Photosynthesis is crucial for:
    - Producing oxygen we breathe
    - Creating food for plants and animals
    - Removing CO2 from atmosphere
    - Supporting all ecosystems
    
    FACTORS AFFECTING PHOTOSYNTHESIS
    - Light intensity: More light increases rate (up to saturation)
    - Temperature: Optimal range 25-35°C
    - CO2 concentration: Higher concentration increases rate
    - Water availability: Essential for light reactions
    - Chlorophyll: Primary light-absorbing pigment
    """
    
    sample_path = "sample_photosynthesis.txt"
    with open(sample_path, "w") as f:
        f.write(sample_txt)
    
    return sample_path, sample_txt


def test_file_extraction():
    """Test file extraction functionality"""
    print("\n" + "="*60)
    print("TEST 1: File Extraction")
    print("="*60)
    
    # Create sample document
    sample_path, sample_content = create_sample_document()
    
    try:
        # Test extraction
        print(f"\n1. Created sample document: {sample_path}")
        print(f"   Size: {len(sample_content)} characters")
        
        # Check if supported
        is_supported = is_supported_file(sample_path)
        print(f"2. File type supported: {is_supported}")
        
        if is_supported:
            # Extract text
            extracted = extract_text(sample_path, sample_path)
            print(f"3. Text extracted successfully")
            print(f"   Extracted: {len(extracted)} characters")
            print(f"   Preview: {extracted[:100]}...")
            
            return extracted
    
    finally:
        # Cleanup
        if os.path.exists(sample_path):
            os.remove(sample_path)
            print(f"\n4. Cleaned up: {sample_path}")


def test_openai_integration(document_content: str):
    """Test OpenAI integration"""
    print("\n" + "="*60)
    print("TEST 2: OpenAI Integration")
    print("="*60)
    
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        print("\n⚠️  OPENAI_API_KEY not set")
        print("   To test with OpenAI:")
        print("   1. Get API key from https://platform.openai.com/account/api-keys")
        print("   2. Set environment: export OPENAI_API_KEY='sk-...'")
        print("   3. Run this script again")
        return False
    
    print(f"\n1. OpenAI API key configured: {api_key[:20]}...")
    
    try:
        # Test with different difficulty levels
        test_questions = [
            ("Photosynthesis là gì?", "beginner"),
            ("What are the two main stages of photosynthesis?", "intermediate"),
        ]
        
        for question, level in test_questions:
            print(f"\n2. Testing question: {question}")
            print(f"   Level: {level}")
            
            response = ask_with_context(
                question=question,
                document_content=document_content,
                level=level
            )
            
            print(f"\n   Response:")
            print(f"   - Answer: {response['answer'][:150]}...")
            print(f"   - Summary: {response['summary']}")
            print(f"   - Key points: {len(response['key_points'])} points")
            print(f"   - Source: {response['source']}")
        
        return True
    
    except RuntimeError as e:
        print(f"\n❌ OpenAI Error: {str(e)}")
        return False


def test_mock_scenario():
    """Show what mock AI would return"""
    print("\n" + "="*60)
    print("TEST 3: Mock AI (Fallback)")
    print("="*60)
    
    print("\nWithout OpenAI API key, the backend uses mock AI:")
    print("- Built-in Vietnamese knowledge base")
    print("- Topics: Photosynthesis, Machine Learning, Quantum Computing")
    print("- All responses in Vietnamese")
    print("- No API costs")
    
    # Mock AI is async, so we need to handle it directly
    print(f"\nMock AI Response (when OpenAI unavailable):")
    print(f"- Sources: Built-in Vietnamese knowledge bases")
    print(f"- Difficulty levels: beginner, intermediate, advanced")
    print(f"- Automatic language detection for inputs")
    print(f"- Always responds in Vietnamese")


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("AI Study Explainer - OpenAI Integration Tests")
    print("="*60)
    
    # Test 1: File extraction
    extracted_content = test_file_extraction()
    
    if extracted_content:
        # Test 2: OpenAI integration
        openai_success = test_openai_integration(extracted_content)
        
        # Test 3: Mock fallback
        test_mock_scenario()
    
    # Summary
    print("\n" + "="*60)
    print("NEXT STEPS")
    print("="*60)
    print("\n1. Start the backend:")
    print("   python main.py")
    print("\n2. Upload a document:")
    print("   curl -F 'file=@document.pdf' http://localhost:8000/api/v1/documents/upload")
    print("\n3. Ask a question:")
    print('   curl -X POST http://localhost:8000/api/v1/chat/ask \\')
    print('     -H "Content-Type: application/json" \\')
    print('     -d \'{"document_id":"uuid","query":"Your question","level":"beginner"}\'')
    print("\n" + "="*60)


if __name__ == "__main__":
    main()
