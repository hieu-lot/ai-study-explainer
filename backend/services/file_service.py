"""
File Service: Extract text from PDF and DOCX files
"""

import logging
from PyPDF2 import PdfReader
from docx import Document

logger = logging.getLogger(__name__)


def is_supported_file(filename: str) -> bool:
    """Return True if filename is PDF or DOCX (case-insensitive)."""
    if not filename:
        return False
    return filename.lower().endswith((".pdf", ".docx"))


def extract_docx(file_path: str) -> str:
    """Extract text from DOCX file"""
    doc = Document(file_path)
    full_text = []

    for para in doc.paragraphs:
        if para.text.strip():
            full_text.append(para.text)

    text = "\n".join(full_text)

    if not text.strip():
        raise ValueError("DOCX has no readable text (maybe scanned or empty)")

    logger.info(f"Extracted {len(text)} characters from DOCX: {file_path}")
    return text


def extract_text(file_path: str) -> str:
    """Extract text from PDF or DOCX file"""
    
    if file_path.lower().endswith(".pdf"):
        reader = PdfReader(file_path)
        text = "\n".join([page.extract_text() or "" for page in reader.pages])

        if not text.strip():
            raise ValueError("PDF has no readable text")

        logger.info(f"Extracted {len(text)} characters from PDF: {file_path}")
        print("Extracted length:", len(text))
        return text

    elif file_path.lower().endswith(".docx"):
        return extract_docx(file_path)

    else:
        raise ValueError("Only PDF and DOCX supported")
