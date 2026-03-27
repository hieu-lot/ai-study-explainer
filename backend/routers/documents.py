import os
import uuid
import sqlite3
import logging

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

from services.file_service import extract_text, is_supported_file

logger = logging.getLogger(__name__)
router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")


class DocumentUploadResponse(BaseModel):
    id: str
    original_name: str
    stored_name: str
    url: str
    content: str


class PageContent(BaseModel):
    page: int
    text: str


class DocumentDetail(BaseModel):
    id: str
    pages: list[PageContent]


def _database_path() -> str:
    database_url = os.getenv("DATABASE_URL", "file:./prisma/dev.db").strip().strip('"').strip("'")
    if database_url.startswith("file:"):
        relative_path = database_url[len("file:"):]
        if os.path.isabs(relative_path):
            return relative_path
        return os.path.normpath(os.path.join(PROJECT_ROOT, relative_path))
    return database_url


def _connect() -> sqlite3.Connection:
    connection = sqlite3.connect(_database_path())
    connection.row_factory = sqlite3.Row
    return connection


def _init_uploaded_documents_table() -> None:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    with _connect() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS UploadedDocument (
                id TEXT PRIMARY KEY,
                original_name TEXT NOT NULL,
                stored_name TEXT NOT NULL,
                file_path TEXT NOT NULL,
                user_id TEXT NOT NULL DEFAULT '',
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        try:
            connection.execute("ALTER TABLE UploadedDocument ADD COLUMN user_id TEXT NOT NULL DEFAULT ''")
        except sqlite3.OperationalError:
            pass
        connection.commit()


def _save_uploaded_document(doc_id: str, original_name: str, stored_name: str, file_path: str, user_id: str = "") -> None:
    with _connect() as connection:
        connection.execute(
            """
            INSERT OR REPLACE INTO UploadedDocument (id, original_name, stored_name, file_path, user_id)
            VALUES (?, ?, ?, ?, ?)
            """,
            (doc_id, original_name, stored_name, file_path, user_id),
        )
        connection.commit()


def _get_uploaded_document(doc_id: str) -> sqlite3.Row | None:
    with _connect() as connection:
        return connection.execute(
            "SELECT id, original_name, stored_name, file_path, created_at FROM UploadedDocument WHERE id = ?",
            (doc_id,),
        ).fetchone()


def _get_document_row(doc_id: str) -> sqlite3.Row | None:
    with _connect() as connection:
        try:
            return connection.execute(
                'SELECT id, name, content, createdAt FROM "Document" WHERE id = ?',
                (doc_id,),
            ).fetchone()
        except sqlite3.OperationalError:
            return None


def _resolve_file_record(doc_id: str) -> dict | None:
    uploaded = _get_uploaded_document(doc_id)
    if uploaded:
        return {
            "id": uploaded["id"],
            "original_name": uploaded["original_name"],
            "stored_name": uploaded["stored_name"],
            "file_path": uploaded["file_path"],
        }
    return None


def _media_type_for_path(file_path: str) -> str:
    lower_path = file_path.lower()
    if lower_path.endswith(".pdf"):
        return "application/pdf"
    if lower_path.endswith(".docx"):
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    return "application/octet-stream"


def _get_documents_by_user(user_id: str) -> list[dict]:
    with _connect() as connection:
        rows = connection.execute(
            "SELECT id, original_name, created_at FROM UploadedDocument WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,),
        ).fetchall()
    return [
        {"id": r["id"], "original_name": r["original_name"], "url": f"http://localhost:8000/{r['id']}/file", "created_at": r["created_at"]}
        for r in rows
    ]


_init_uploaded_documents_table()


@router.get("/documents")
async def list_documents(user_id: str = ""):
    if not user_id:
        return []
    return _get_documents_by_user(user_id)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...), user_id: str = ""):
    filename = os.path.basename((file.filename or "").strip())
    if not is_supported_file(filename):
        return {"error": "Only PDF and DOCX files supported"}

    doc_id = str(uuid.uuid4())
    stored_name = f"{uuid.uuid4().hex}_{filename}"
    file_path = os.path.join(UPLOAD_DIR, stored_name)
    contents = await file.read()

    try:
        with open(file_path, "wb") as saved_file:
            saved_file.write(contents)
    except Exception as error:
        logger.error("Error saving file: %s", error)
        return {"error": f"Failed to save file: {error}"}

    logger.info("Saved uploaded file to %s", file_path)

    try:
        extracted_text = extract_text(file_path)
    except Exception as error:
        logger.error("Error extracting text from %s: %s", filename, error)
        return {"error": str(error)}

    _save_uploaded_document(doc_id, filename, stored_name, file_path, user_id)

    return {
        "id": doc_id,
        "original_name": filename,
        "stored_name": stored_name,
        "url": f"http://localhost:8000/{doc_id}/file",
        "content": extracted_text,
    }


@router.get("/{id}", response_model=DocumentDetail)
async def get_document(id: str):
    content = get_document_text(id)
    if not content:
        record = _resolve_file_record(id)
        if not record:
            raise HTTPException(status_code=404, detail="Document not found.")
        try:
            content = extract_text(record["file_path"])
        except Exception as error:
            logger.error("Error extracting text for %s: %s", id, error)
            raise HTTPException(status_code=500, detail="Failed to read document.") from error

    return DocumentDetail(id=id, pages=[PageContent(page=1, text=content)])


@router.get("/{id}/file")
async def get_document_file(id: str):
    record = _resolve_file_record(id)
    if not record:
        raise HTTPException(status_code=404, detail="Document not found.")

    file_path = record["file_path"]
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File content not available: {file_path}")

    print("Serving file:", file_path)

    return FileResponse(file_path, media_type=_media_type_for_path(file_path))


def get_document_text(doc_id: str) -> str:
    document = _get_document_row(doc_id)
    if not document:
        return ""
    return document["content"] or ""
