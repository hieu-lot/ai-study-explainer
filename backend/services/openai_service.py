"""
OpenAI Service: Provide document-aware Q&A in Vietnamese using GPT-4 Turbo
"""

import logging
import os
from openai import OpenAI

logger = logging.getLogger(__name__)

# Initialize client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    logger.warning("OPENAI_API_KEY not set. OpenAI features will fail.")

client = OpenAI(api_key=api_key) if api_key else None


async def ask_with_context(question: str, document_content: str, level: str = "beginner") -> dict:
    """
    Ask a question based on document content using OpenAI.
    
    Args:
        question: The user's question (in Vietnamese or English)
        document_content: The document text to provide context (truncated to 5000 chars)
        level: Difficulty level (beginner, intermediate, advanced)
    
    Returns:
        dict with keys: answer, summary, key_points, difficulty, source
    """
    if not client:
        raise RuntimeError("OpenAI API key is not configured. Set OPENAI_API_KEY environment variable.")
    
    # Truncate document to avoid token limits
    doc_truncated = document_content[:5000] if document_content else "(No document content)"
    
    # Build system prompt for Vietnamese responses
    system_prompt = """Bạn là một trợ lý học tập thông minh, chuyên giáo dục.

Your task:
1. Answer in VIETNAMESE only
2. Use information from the provided document
3. Be clear, simple, and accurate
4. Adapt complexity to the requested level:
   - beginner: Very simple, basic concepts, lots of examples
   - intermediate: More technical, some detail, structured explanation
   - advanced: Deep understanding, technical accuracy, comprehensive

Keep answers focused and well-organized."""

    # Build user prompt
    user_prompt = f"""DOCUMENT CONTEXT:
{doc_truncated}

DIFFICULTY LEVEL: {level}

USER QUESTION: {question}

Please answer based on the document content. If the document doesn't contain relevant information, acknowledge this but provide helpful general knowledge in Vietnamese."""

    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1000,
            temperature=0.7,
        )
        
        answer = response.choices[0].message.content
        
        # Extract a summary (first sentence or first 100 chars)
        summary = answer.split('\n')[0][:150] if answer else "Không có câu trả lời."
        
        # Extract key points (split by bullet points if present, otherwise use sentences)
        key_points = []
        if '•' in answer or '-' in answer:
            lines = answer.split('\n')
            key_points = [line.strip('•- ').strip() for line in lines if line.strip('•- ').strip()][:3]
        else:
            sentences = answer.split('. ')
            key_points = [s.strip() + '.' for s in sentences[:3] if s.strip()]
        
        logger.info(f"OpenAI response generated for question: {question[:50]}...")
        
        return {
            "answer": answer,
            "summary": summary,
            "key_points": key_points,
            "difficulty": level,
            "source": "openai",
        }
    
    except Exception as e:
        logger.error(f"OpenAI API error: {str(e)}")
        raise RuntimeError(f"Failed to get response from OpenAI: {str(e)}")

