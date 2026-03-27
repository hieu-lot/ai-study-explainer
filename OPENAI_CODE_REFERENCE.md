# OpenAI Integration - Code Reference & Examples

## 📝 Code Snippets

### Backend Service Examples

#### 1. OpenAI Service Usage
```python
from services.openai_service import ask_with_context

# Basic usage
response = ask_with_context(
    question="Tài liệu này nói về cái gì?",
    document_content="Photosynthesis is the process...",
    level="beginner"
)

# Access response
answer = response["answer"]           # Full answer
summary = response["summary"]         # One-line summary
key_points = response["key_points"]   # List of key points
source = response["source"]           # "openai" or "mock"
difficulty = response["difficulty"]  # "beginner", "intermediate", "advanced"
```

#### 2. File Service Usage
```python
from services.file_service import extract_text, is_supported_file

# Check if file is supported
if is_supported_file("document.pdf"):
    # Extract text
    text = extract_text("path/to/document.pdf", "document.pdf")
    print(f"Extracted {len(text)} characters")
```

#### 3. Document Router Usage
```python
from routers.documents import document_content, get_document_text

# Store document content after upload
document_content["doc-uuid"] = "extracted text"

# Retrieve document content
text = get_document_text("doc-uuid")
```

---

## 🌐 REST API Examples

### cURL Examples

#### Upload a PDF
```bash
curl -X POST \
  -F "file=@path/to/document.pdf" \
  http://localhost:8000/api/v1/documents/upload

# Response:
# {
#   "status": "uploaded",
#   "id": "550e8400-e29b-41d4-a716-446655440000",
#   "filename": "document.pdf",
#   "message": "Uploaded successfully"
# }
```

#### Upload a Word Document
```bash
curl -X POST \
  -F "file=@document.docx" \
  http://localhost:8000/api/v1/documents/upload
```

#### Upload a Text File
```bash
curl -X POST \
  -F "file=@notes.txt" \
  http://localhost:8000/api/v1/documents/upload
```

#### Ask Question (Beginner Level)
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "550e8400-e29b-41d4-a716-446655440000",
    "query": "What is the main topic?",
    "level": "beginner"
  }' \
  http://localhost:8000/api/v1/chat/ask
```

#### Ask Question (Intermediate Level)
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "550e8400-e29b-41d4-a716-446655440000",
    "query": "Giải thích chi tiết về khái niệm chính",
    "level": "intermediate"
  }' \
  http://localhost:8000/api/v1/chat/ask
```

#### Ask Question (Advanced/Expert Level)
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "550e8400-e29b-41d4-a716-446655440000",
    "query": "What are the theoretical implications?",
    "level": "expert"
  }' \
  http://localhost:8000/api/v1/chat/ask
```

---

## 🐍 Python Client Examples

### Simple Python Script
```python
import requests
import json

BASE_URL = "http://localhost:8000"

def upload_document(file_path):
    """Upload a document and return its ID"""
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(
            f"{BASE_URL}/api/v1/documents/upload",
            files=files
        )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Uploaded: {data['filename']}")
        print(f"  ID: {data['id']}")
        return data['id']
    else:
        print(f"✗ Upload failed: {response.status_code}")
        return None


def ask_question(doc_id, question, level="beginner"):
    """Ask a question about an uploaded document"""
    payload = {
        "document_id": doc_id,
        "query": question,
        "level": level
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/chat/ask",
        json=payload
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n📝 Answer ({data['level']} level):")
        print(data['answer'])
        print(f"\n📌 Summary:")
        print(data['citations'][0]['text'])
        return data
    else:
        print(f"✗ Request failed: {response.status_code}")
        return None


# Usage
if __name__ == "__main__":
    # Upload document
    doc_id = upload_document("document.pdf")
    
    if doc_id:
        # Ask questions
        ask_question(doc_id, "Tài liệu này nói về cái gì?", "beginner")
        ask_question(doc_id, "What are the key concepts?", "intermediate")
```

### Advanced Python Example with Error Handling
```python
import requests
from typing import Optional, Dict
import time

class AIDocumentClient:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
    
    def upload(self, file_path: str) -> Optional[str]:
        """Upload a document"""
        try:
            with open(file_path, 'rb') as f:
                files = {'file': f}
                response = self.session.post(
                    f"{self.base_url}/api/v1/documents/upload",
                    files=files,
                    timeout=30
                )
            response.raise_for_status()
            return response.json()['id']
        
        except FileNotFoundError:
            print(f"File not found: {file_path}")
            return None
        except requests.exceptions.RequestException as e:
            print(f"Upload failed: {str(e)}")
            return None
    
    def ask(self, doc_id: str, question: str, level: str = "beginner") -> Optional[Dict]:
        """Ask a question about a document"""
        try:
            payload = {
                "document_id": doc_id,
                "query": question,
                "level": level
            }
            
            response = self.session.post(
                f"{self.base_url}/api/v1/chat/ask",
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        
        except requests.exceptions.Timeout:
            print("Request timed out (this is normal for large documents)")
            return None
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {str(e)}")
            return None
    
    def close(self):
        """Clean up"""
        self.session.close()


# Usage
if __name__ == "__main__":
    client = AIDocumentClient()
    
    try:
        # Upload
        print("📤 Uploading document...")
        doc_id = client.upload("research_paper.pdf")
        
        if doc_id:
            print(f"✓ Document ID: {doc_id}\n")
            
            # Ask multiple questions
            questions = [
                ("Tài liệu cung cấp những gì?", "beginner"),
                ("Phương pháp nghiên cứu là gì?", "intermediate"),
                ("Tác động lý thuyết là gì?", "expert"),
            ]
            
            for question, level in questions:
                print(f"\n❓ Asking ({level}): {question}")
                result = client.ask(doc_id, question, level)
                
                if result:
                    print(f"✓ Answer:\n{result['answer'][:200]}...")
                    time.sleep(1)  # Rate limiting
    
    finally:
        client.close()
```

---

## 📊 Response Format Reference

### Upload Response
```json
{
  "status": "uploaded",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "document.pdf",
  "message": "Uploaded successfully"
}
```

### Chat Response
```json
{
  "answer": "Photosynthesis là quá trình các cây chuyển đổi ánh sáng mặt trời thành năng lượng hóa học...",
  "citations": [
    {
      "page": 1,
      "text": "Quá trình chuyển hóa mà các cây sử dụng để tạo ra đường từ ánh sáng."
    }
  ],
  "level": "beginner"
}
```

---

## 🔄 Full Workflow Example

```python
import requests
import json

# Configuration
BASE_URL = "http://localhost:8000"
DOCUMENT_PATH = "my_document.pdf"

def main():
    print("AI Document Q&A Workflow\n" + "="*50)
    
    # Step 1: Upload Document
    print("\n📤 Step 1: Uploading document...")
    with open(DOCUMENT_PATH, 'rb') as f:
        response = requests.post(
            f"{BASE_URL}/api/v1/documents/upload",
            files={"file": f}
        )
    
    if response.status_code != 200:
        print(f"❌ Upload failed: {response.status_code}")
        return
    
    doc_id = response.json()["id"]
    print(f"✅ Document uploaded: {doc_id}")
    
    # Step 2: Ask Questions
    print("\n💬 Step 2: Asking questions...")
    
    questions = [
        ("What is the main topic?", "beginner"),
        ("What are the key findings?", "intermediate"),
        ("What are the implications?", "expert"),
    ]
    
    for question, level in questions:
        print(f"\n  Question: {question}")
        print(f"  Level: {level}")
        
        response = requests.post(
            f"{BASE_URL}/api/v1/chat/ask",
            json={
                "document_id": doc_id,
                "query": question,
                "level": level
            }
        )
        
        if response.status_code == 200:
            answer = response.json()["answer"]
            print(f"  Answer: {answer[:150]}...")
        else:
            print(f"  Error: {response.status_code}")
    
    print("\n" + "="*50)
    print("✅ Workflow complete!")

if __name__ == "__main__":
    main()
```

---

## 🧪 Testing Commands

### Test File Extraction
```bash
cd backend
python -c "
from services.file_service import extract_text

# Create test file
with open('test.txt', 'w') as f:
    f.write('Test content')

# Extract
text = extract_text('test.txt', 'test.txt')
print(f'Extracted: {text}')
"
```

### Test OpenAI Service
```bash
cd backend
python -c "
import os
os.environ['OPENAI_API_KEY'] = 'sk-your-key'
from services.openai_service import ask_with_context

response = ask_with_context(
    'Summary test',
    'This is a test document about AI.',
    'beginner'
)
print('Response keys:', response.keys())
"
```

### Test Full Integration
```bash
cd backend
python test_openai_integration.py
```

---

## 🚀 Quick Start Commands

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Setup environment
cp .env.example .env
# Edit .env with your API key

# 4. Run tests
python test_openai_integration.py

# 5. Start backend
python main.py

# 6. In another terminal, upload and ask
curl -F "file=@document.pdf" http://localhost:8000/api/v1/documents/upload
```

---

## 📚 Environment Variables

```bash
# Required for OpenAI features
OPENAI_API_KEY=sk-your-api-key-here

# Optional
BACKEND_PORT=8000
DEBUG=false
```

---

**Reference Complete** ✅

See `OPENAI_SETUP.md` for detailed setup instructions.
