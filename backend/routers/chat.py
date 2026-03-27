"""
Router: /api/v1/chat
Handles contextual Q&A against a specific document using OpenAI.
"""

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from enum import Enum

from services import openai_service
from routers.documents import get_document_text

logger = logging.getLogger(__name__)
router = APIRouter()


# ---------- Schemas ----------

class ExplanationLevel(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    expert = "expert"


class ChatRequest(BaseModel):
    document_id: str
    query: str
    level: ExplanationLevel = ExplanationLevel.intermediate


class Citation(BaseModel):
    page: int
    text: str


class ChatResponse(BaseModel):
    answer: str
    citations: list[Citation]
    level: ExplanationLevel


# ---------- Helpers ----------

async def get_openai_response(question: str, document_id: str, level: str):
    """Get response from OpenAI using document content"""

    # Get document content
    doc_content = get_document_text(document_id)

    if not doc_content:
        raise HTTPException(
            status_code=404,
            detail=f"Document {document_id} not found"
        )

    try:
        result = await openai_service.ask_with_context(
            question=question,
            document_content=doc_content,
            level=level,
        )
        return result

    except Exception as e:
        logger.exception(f"OpenAI API error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ---------- Endpoints ----------

@router.post("/ask", response_model=ChatResponse)
async def ask_question(req: ChatRequest):
    """
    Submit a question in the context of a document.
    
    Requires OPENAI_API_KEY environment variable to be set.
    """
    try:
        logger.debug(
            "Chat request: doc_id=%s, query_len=%s, level=%s",
            req.document_id,
            len(req.query),
            req.level,
        )

        result = await get_openai_response(
            question=req.query,
            document_id=req.document_id,
            level=req.level.value,
        )

        logger.debug("OpenAI response generated successfully.")

        return ChatResponse(
            answer=result.get("answer", result if isinstance(result, str) else "No answer returned."),
            citations=[
                Citation(
                    page=1,
                    text="Generated from document"
                )
            ],
            level=req.level,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Chat service error")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )