"""
Router: /api/v1/flashcards
Handles flashcard deck management and study responses.
Flashcard generation from document content requires document_id in request.
"""

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from routers import documents

logger = logging.getLogger(__name__)
router = APIRouter()


# ---------- Schemas ----------

class FlashcardGenerateRequest(BaseModel):
    source_text: str
    count: int = 5


class Flashcard(BaseModel):
    front: str
    back: str


class FlashcardGenerateResponse(BaseModel):
    cards: list[Flashcard]


class ReviewRequest(BaseModel):
    card_id: str
    quality: str  # "again" | "hard" | "good"


# ---------- Endpoints ----------

@router.post("/generate", response_model=FlashcardGenerateResponse)
async def generate_flashcards(req: FlashcardGenerateRequest):
    """
    Auto-generate flashcards from a text snippet.
    
    Note: Flashcard generation from source_text is currently disabled.
    Use the /api/v1/documents/upload endpoint to upload content, 
    then use the chat endpoint for interactive Q&A.
    """
    try:
        logger.debug(f"Flashcard generation request: count={req.count}, text_len={len(req.source_text)}")
        
        # Return empty response for now
        raise HTTPException(
            status_code=503,
            detail="Flashcard generation is not available. Use document upload and chat Q&A instead."
        )
    
    except Exception as e:
        # Log error and raise HTTP exception
        logger.error(f"AI service error: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate flashcards")


@router.post("/review")
async def submit_review(req: ReviewRequest):
    """Record a study response for spaced repetition scheduling.
    TODO: update next_review timestamp in database via SRS algorithm.
    """
    return {"status": "recorded", "card_id": req.card_id, "quality": req.quality}


@router.get("/decks")
async def list_decks():
    """List all flashcard decks for the current user.
    TODO: query database filtered by authenticated user_id.
    """
    return [
        {"id": "deck-1", "name": "Biology 101", "card_count": 42, "mastery": 68},
        {"id": "deck-2", "name": "CS 201 — Algorithms", "card_count": 18, "mastery": 85},
    ]
