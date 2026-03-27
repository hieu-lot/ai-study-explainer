import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

load_dotenv()

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.info("Backend starting...")

from routers.documents import router as documents_router
from routers.chat import router as chat_router
from routers.flashcards import router as flashcards_router

app = FastAPI(title="AI Study Explainer API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
async def health_check():
    return {"ok": True}

app.include_router(documents_router, prefix="", tags=["documents"])
app.include_router(chat_router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(flashcards_router, prefix="/api/v1/flashcards", tags=["flashcards"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
uploads_dir = os.path.join(BASE_DIR, "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.get("/files/{filename}")
async def get_file(filename: str):
    safe_name = os.path.basename(filename)
    file_path = os.path.join(uploads_dir, safe_name)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    lower = safe_name.lower()
    if lower.endswith(".pdf"):
        media_type = "application/pdf"
    elif lower.endswith(".docx"):
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    else:
        media_type = None

    return FileResponse(file_path, media_type=media_type)