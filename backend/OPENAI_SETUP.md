# AI Study Explainer - OpenAI Document Q&A Backend

## ✨ New Features

- **OpenAI Integration**: Uses GPT-4 Turbo for intelligent Q&A
- **Document Upload**: Support for PDF, DOCX, and TXT files
- **Document-Based Q&A**: Ask questions about uploaded documents
- **Vietnamese Responses**: Always responds in Vietnamese
- **Fallback to Mock AI**: Works without OpenAI API key (uses mock responses)

## 🚀 Quick Start

### 1. Setup Environment

```bash
cd backend

# Create .env file with your OpenAI API key
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Backend

```bash
python main.py
# or
uvicorn main:app --reload
```

Backend will start at: `http://localhost:8000`

## 📚 New Endpoints

### Upload Document
```http
POST /api/v1/documents/upload
Content-Type: multipart/form-data

file: <PDF, DOCX, or TXT file>
```

**Response:**
```json
{
  "status": "uploaded",
  "id": "uuid-string",
  "filename": "document.pdf",
  "message": "Uploaded successfully"
}
```

### Ask Question About Document
```http
POST /api/v1/chat/ask
Content-Type: application/json

{
  "document_id": "uuid-from-upload",
  "query": "Hỏi câu hỏi bằng tiếng Anh hoặc Việt",
  "level": "beginner" | "intermediate" | "expert"
}
```

**Response:**
```json
{
  "answer": "Chi tiết câu trả lời bằng tiếng Việt...",
  "citations": [
    {
      "page": 1,
      "text": "Tóm tắt câu trả lời"
    }
  ],
  "level": "beginner"
}
```

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (required for OpenAI features)
- `BACKEND_PORT`: Port to run backend (default: 8000)

### File Size Limits
- Documents are truncated to 5000 characters for token efficiency
- Max upload size: 50 MB
- Supported formats: PDF, DOCX, TXT, MD

## 📋 Supported File Types

| Format | Extension | Library |
|--------|-----------|---------|
| PDF | .pdf | PyPDF2 |
| Word | .docx | python-docx |
| Text | .txt | Built-in |
| Markdown | .md | Built-in |

## 🔄 How It Works

1. **Upload**: User uploads a document (PDF, DOCX, TXT)
2. **Extract**: Backend extracts text from the file
3. **Store**: Text is stored in memory with unique ID
4. **Query**: User asks a question with the document ID
5. **AI Process**: 
   - OpenAI receives: System prompt (Vietnamese), document context, user question
   - Returns: Detailed answer in Vietnamese
6. **Response**: Answer is returned with citations and difficulty level

## 🔌 Fallback Behavior

If OpenAI API key is not configured or fails:
- Backend automatically falls back to mock AI service
- Responses are generated from built-in Vietnamese knowledge base
- No errors - seamless fallback

## 📝 Example Usage

### Python
```python
import requests

# Upload document
response = requests.post(
    "http://localhost:8000/api/v1/documents/upload",
    files={"file": open("document.pdf", "rb")}
)
doc_id = response.json()["id"]

# Ask question
response = requests.post(
    "http://localhost:8000/api/v1/chat/ask",
    json={
        "document_id": doc_id,
        "query": "What is the main topic of this document?",
        "level": "intermediate"
    }
)
answer = response.json()["answer"]
print(answer)
```

### cURL
```bash
# Upload
curl -X POST \
  -F "file=@document.pdf" \
  http://localhost:8000/api/v1/documents/upload

# Ask question
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "uuid-here",
    "query": "What is the main topic?",
    "level": "intermediate"
  }' \
  http://localhost:8000/api/v1/chat/ask
```

## 🏗️ Project Structure

```
backend/
├── main.py                    # FastAPI app entry point
├── requirements.txt           # Python dependencies
├── .env.example              # Environment template
├── services/
│   ├── ai_service.py         # Mock AI (fallback)
│   ├── openai_service.py     # OpenAI integration (NEW)
│   ├── file_service.py       # File processing (NEW)
│   └── ...
├── routers/
│   ├── chat.py              # Q&A endpoint (UPDATED)
│   ├── documents.py         # File upload (UPDATED)
│   └── ...
└── temp_uploads/            # Uploaded files storage
```

## 🔐 Security Notes

- API keys should be in `.env` file (never commit to git)
- `.env` is in `.gitignore`
- Use `.env.example` as template for documentation
- Document storage is in-memory (not persistent)

## 🚨 Troubleshooting

### "OpenAI API key is not configured"
- Create `.env` file with `OPENAI_API_KEY`
- Get key from https://platform.openai.com/account/api-keys

### "Failed to extract text from PDF"
- Ensure PyPDF2 is installed: `pip install PyPDF2`
- PDF might be corrupted or image-only

### "Document not found"
- Use the correct document_id returned from upload
- Document IDs are UUIDs

### "Token limit exceeded"
- Documents > 5000 chars are automatically truncated
- This is by design to manage API costs

## 📚 Dependencies Added

```
openai>=1.3.0           # OpenAI API
PyPDF2>=4.0.0          # PDF text extraction
python-docx>=0.8.11    # DOCX support
```

## 🔄 Backward Compatibility

- All existing API routes remain unchanged
- Mock AI is fully functional without OpenAI key
- Can switch between OpenAI and mock seamlessly
- No breaking changes to frontend

## 📞 Support

For issues or questions:
1. Check if OpenAI API key is set
2. Verify dependencies are installed
3. Check backend logs for detailed messages
4. Test with sample document from examples/

---

**Version**: 2.0 (OpenAI Integration)  
**Last Updated**: 2026-03-25
