"""
Service: pdf_parser
Extracts text and page structure from uploaded PDF files using pypdf.
"""

import io
from pypdf import PdfReader


def parse_pdf(file_bytes: bytes) -> list[dict]:
    """Parse a PDF file and return structured text by page.

    Args:
        file_bytes: Raw bytes of the PDF file.

    Returns:
        List of dicts: [{"page": 1, "text": "..."}, ...]

    Raises:
        ValueError: If the file cannot be parsed as a valid PDF.
    """
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {e}")

    pages: list[dict] = []
    for i, pdf_page in enumerate(reader.pages):
        text = pdf_page.extract_text() or ""
        pages.append({"page": i + 1, "text": text.strip()})

    return pages
