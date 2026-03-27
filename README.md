# AI Study Explainer + Research Organizer

A Next.js 14 frontend + FastAPI backend skeleton for an AI-powered study workspace.

## Tech Stack

**Frontend**
- Next.js 14 (App Router) + TypeScript, TailwindCSS 3.4, lucide-react, clsx + tailwind-merge

**Backend**
- FastAPI (Python 3.11), uvicorn, pypdf, pydantic

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# → http://localhost:3000 (auto-redirects to /dashboard)
```

## Project Structure

```
ai-study-explainer/
├── app/
│   ├── globals.css            # Tailwind + design tokens + glassmorphism
│   ├── layout.tsx             # Root layout (html, font)
│   ├── page.tsx               # Redirect → /dashboard
│   └── (app)/                 # Authenticated route group
│       ├── layout.tsx         # Sidebar + TopNav wrapper
│       ├── dashboard/page.tsx # Upload zone, recent docs, stats
│       ├── library/page.tsx   # Search, folders, tags, grid/list
│       ├── doc/[id]/page.tsx  # ★ Study Workspace (3-panel)
│       └── flashcards/page.tsx# Deck selector + flip card study
├── components/
│   ├── Sidebar.tsx            # Collapsible left nav (240→64px)
│   ├── TopNav.tsx             # Top bar with search/notifications
│   ├── SearchBar.tsx          # Cmd+K search overlay
│   ├── DocumentViewer.tsx     # ★ PDF/text viewer + floating toolbar
│   ├── AIChatPanel.tsx        # ★ AI chat + citations + level pills
│   ├── FlashcardCard.tsx      # 3D flip card (400ms)
│   ├── UploadDropzone.tsx     # Drag-and-drop upload
│   └── SkeletonLoader.tsx     # Shimmer loading placeholders
├── lib/
│   ├── utils.ts               # cn() class merge helper
│   └── mock-data.ts           # 30-page doc, chat, flashcards
└── config files               # package.json, tailwind, tsconfig, postcss
```

## Testing Mock Flows

### Study Workspace (`/doc/paper-001`)
1. **Text Selection**: Select any text in the document viewer → floating toolbar appears
2. **Explain**: Click "Explain" → mock AI response appears in chat panel with citation chips
3. **Citation Click**: Click `p.N` chip → document viewer navigates to that page with highlight pulse
4. **Flashcard**: Click "Flashcard" → alert shows generated Q&A preview
5. **Note**: Click "Note" → snippet saved, visible in Notes tab
6. **Keyboard**: Arrow keys to paginate, Tab to chat input

### Flashcard Hub (`/flashcards`)
- Click a deck → study mode loads
- Click card or press Space → 3D flip animation
- Click Again/Hard/Good → next card with progress tracking

### Navigation
- Sidebar expand/collapse via bottom toggle
- `Ctrl+K` / `Cmd+K` → search overlay
- Sidebar links navigate between pages with 240ms crossfade

## Where to Integrate Real APIs

All mock data and fake responses are in `lib/mock-data.ts` and inline `mockFetchExplain` functions.
Replace these with real API calls:

| Mock | Replace with |
|------|-------------|
| `mockDocument` | `GET /api/v1/documents/:id` |
| `mockFetchExplain()` | `POST /api/v1/chat/ask` |
| Flashcard alert | `POST /api/v1/flashcards/generate` |
| `mockRecentDocs` | `GET /api/v1/documents?sort=recent` |
| File upload console.log | `POST /api/v1/documents` |

## Backend (FastAPI)

### Project Structure

```
backend/
├── main.py                  # FastAPI app, CORS, router mounting
├── requirements.txt         # Python dependencies
├── routers/
│   ├── documents.py         # Upload, list, get, delete documents
│   ├── chat.py              # Contextual Q&A with explanation levels
│   └── flashcards.py        # Generate, review, list decks
└── services/
    ├── pdf_parser.py         # Stub: PDF text extraction
    ├── ai_service.py         # Stub: Gemini AI integration
    └── embeddings.py         # Stub: Vector embeddings for RAG
```

### Quick Start (Backend)

```bash
cd backend

# 1. Create virtual environment
python -m venv .venv

# 2. Activate (Windows)
.venv\Scripts\activate
# Or (macOS/Linux): source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start server
uvicorn main:app --reload --port 8000

# → http://localhost:8000/docs  (Swagger UI)
```

### API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/v1/health` | Health check → `{"ok": true}` |
| `POST` | `/api/v1/documents/upload` | Upload PDF/TXT → `{status, id}` |
| `GET` | `/api/v1/documents/` | List all documents |
| `GET` | `/api/v1/documents/{id}` | Get document metadata |
| `DELETE` | `/api/v1/documents/{id}` | Delete a document |
| `POST` | `/api/v1/chat/ask` | Ask question with level → answer + citations |
| `POST` | `/api/v1/flashcards/generate` | Generate flashcards from text |
| `POST` | `/api/v1/flashcards/review` | Submit study response |
| `GET` | `/api/v1/flashcards/decks` | List flashcard decks |

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
MOCK_AI=true
```

**Note:** The project uses mock AI (no API keys required). The backend runs 100% offline using realistic predefined responses.
