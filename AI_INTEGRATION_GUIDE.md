# AI Feature Integration Guide

## Overview
Your AI features are now integrated into the existing components. Here's how everything works:

---

## Files Modified & Created

### 1. ✅ **components/AIChatPanel.tsx** (MODIFIED)
**Status**: Fully updated to use OpenAI API

**Key Changes**:
- ✅ Added `"use client"` directive (already there)
- ✅ Imports now include: `explainContent`, `summarizeContent`, `generateQuiz`, `isAPIError` from `@/lib/ai`
- ✅ Added `mode` state tracking current AI mode: `"chat" | "summarize" | "explain" | "quiz"`
- ✅ Added `bilingual` boolean state for language preference
- ✅ Added `error` state for error display
- ✅ New `callAIEndpoint()` function handles mode-specific AI calls
- ✅ Updated `handleSend()` to work with both chat and mode-specific requests
- ✅ Updated UI footer with:
  - **Mode selector buttons**: Chat, Summarize, Explain, Quiz
  - **Bilingual toggle**: Checkbox to include English translations
  - **Placeholder text** changes based on selected mode
  - **Error display** with red background
  - **Loading spinner** in send button

**State Management**:
```typescript
const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
const [input, setInput] = useState("");
const [generating, setGenerating] = useState(false);
const [mode, setMode] = useState<Mode>("chat");          // ← NEW
const [bilingual, setBilingual] = useState(false);       // ← NEW
const [tab, setTab] = useState<"chat" | "notes">("chat");
const [error, setError] = useState<string | null>(null); // ← NEW
```

**How It Works**:
1. User selects a mode (Chat/Summarize/Explain/Quiz)
2. User toggles bilingual if needed
3. User enters text in input field
4. On send, the appropriate AI function is called (`summarizeContent()`, `explainContent()`, or `generateQuiz()`)
5. Response is received and displayed in the message thread
6. Errors are caught and displayed below the mode selector

---

### 2. ✅ **components/AIActions.tsx** (NEW)
**Status**: Ready to use

**Purpose**: Quick action buttons for any selected text

**How to Use It**:
```typescript
import AIActions from "@/components/AIActions";

// In your component:
<AIActions
  selectedText="The text to process"
  bilingual={false}
  onResult={(result, mode) => console.log(result)}
/>
```

**Features**:
- Shows inline action buttons or floating results panel
- Displays result in a modal-like view
- Copy-to-clipboard functionality
- Shows loading state on the active button

---

### 3. ✅ **lib/ai/promptBuilder.ts** (ALREADY CREATED)
**Status**: Ready to use

**Provides**:
- `buildPrompt()` - Creates system + user message pairs
- `validateQuizResponse()` - Validates quiz format
- `formatQuizResponse()` - Ensures proper structure

---

### 4. ✅ **lib/ai/client.ts** (ALREADY CREATED)
**Status**: Ready to use

**Provides**:
- `callAI()` - Raw API call
- `summarizeContent()` - Summarize text
- `explainContent()` - Explain text simply
- `generateQuiz()` - Generate 5 multiple-choice questions
- `isAPIError()` - Type guard for error checking

---

### 5. ✅ **lib/ai/index.ts** (ALREADY CREATED)
**Status**: Ready to use - centralized exports

**Simplifies imports**:
```typescript
// Instead of:
import { summarizeContent } from "@/lib/ai/client";
import { buildPrompt } from "@/lib/ai/promptBuilder";

// Use:
import { summarizeContent, buildPrompt } from "@/lib/ai";
```

---

### 6. ✅ **app/api/ai/route.ts** (ALREADY CREATED)
**Status**: Ready to use

**Endpoint**: `POST /api/ai`

**Accepts**:
```json
{
  "input": "text to process",
  "mode": "summarize" | "explain" | "quiz",
  "bilingual": true | false
}
```

**Returns**:
```json
{
  "success": true,
  "mode": "explain",
  "bilingual": false,
  "output": "AI response here..."
}
```

---

## Integration Examples

### Example 1: Using AIChatPanel (Already Integrated ✅)

The component is already integrated in `/app/(app)/doc/[id]/page.tsx`:

```typescript
<AIChatPanel
  documentId={documentId}
  initialMessages={[]}
  onCitationClick={handleCitationClick}
  notes={notes}
  className="w-full"
/>
```

**How to use**:
1. User opens a document
2. AIChatPanel is shown on the right
3. User types text in input field
4. User selects a mode: **Chat**, **Summarize**, **Explain**, or **Quiz**
5. User toggles **Bilingual** if they want Vietnamese + English
6. User clicks send or presses Enter
7. AI response appears in the message thread

---

### Example 2: Adding AIActions to Dashboard

To add quick AI actions to the dashboard document cards:

```typescript
"use client";
import { useState } from "react";
import AIActions from "@/components/AIActions";
import { mockRecentDocs } from "@/lib/mock-data";

export default function DashboardPage() {
  const [selectedText, setSelectedText] = useState("");

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-10">
      {/* ... existing upload zone ... */}

      {/* Selected Text Actions (Optional) */}
      {selectedText && (
        <AIActions
          selectedText={selectedText}
          bilingual={false}
          onResult={(result) => {
            console.log("AI result:", result);
            setSelectedText("");
          }}
          className="mb-4"
        />
      )}

      {/* ... rest of dashboard ... */}
    </div>
  );
}
```

---

### Example 3: Adding to a Custom Component

```typescript
"use client";
import { useState } from "react";
import { explainContent, isAPIError } from "@/lib/ai";

export function MyComponent() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bilingual, setBilingual] = useState(false);

  const handleExplain = async (text: string) => {
    setLoading(true);
    setError(null);

    const response = await explainContent(text, bilingual);

    if (isAPIError(response)) {
      setError(response.error);
    } else {
      setResult(response.output);
    }

    setLoading(false);
  };

  return (
    <div>
      <button onClick={() => handleExplain("Your text here")}>
        {loading ? "Loading..." : "Explain"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && <pre>{result}</pre>}
    </div>
  );
}
```

---

## State Management Pattern

All AI functions follow this pattern:

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [result, setResult] = useState<string | null>(null);
const [mode, setMode] = useState<"summarize" | "explain" | "quiz">("explain");
const [bilingual, setBilingual] = useState(false);

const handleAIAction = async (text: string) => {
  setLoading(true);
  setError(null);

  const response = await (mode === "summarize" 
    ? summarizeContent(text, bilingual)
    : mode === "explain"
    ? explainContent(text, bilingual)
    : generateQuiz(text, bilingual)
  );

  if (isAPIError(response)) {
    setError(response.error);
  } else {
    setResult(response.output);
  }

  setLoading(false);
};
```

---

## Rendering Patterns

### Pattern 1: Modal/Panel Display (AIChatPanel)
```typescript
{result && (
  <div className="bg-white border rounded-lg p-4">
    <h3 className="font-semibold mb-2">Result</h3>
    <pre className="whitespace-pre-wrap text-sm">{result}</pre>
  </div>
)}
```

### Pattern 2: Inline Display
```typescript
{loading && <span>Loading...</span>}
{error && <div style={{ color: "red" }}>{error}</div>}
{result && <dialog open>{result}</dialog>}
```

### Pattern 3: Message Thread (like AIChatPanel)
```typescript
{messages.map((msg) => (
  <div key={msg.id}>
    <strong>{msg.role === "user" ? "You" : "AI"}:</strong>
    <p>{msg.content}</p>
  </div>
))}
```

---

## Environment Setup Checklist

- ✅ Created `lib/ai/promptBuilder.ts`
- ✅ Created `lib/ai/client.ts` 
- ✅ Created `lib/ai/index.ts`
- ✅ Created `app/api/ai/route.ts`
- ✅ Created `components/AIActions.tsx`
- ✅ Updated `components/AIChatPanel.tsx`
- ⏳ Update `.env.local` with `OPENAI_API_KEY=sk_...`

**Required Environment Variable**:
```
OPENAI_API_KEY=sk_your_openai_api_key_here
```

---

## Testing the Integration

### Test 1: In AIChatPanel
1. Open a document at `/doc/[id]`
2. Type text in the chat input
3. Click "Explain" button
4. Type test text and send
5. Should see AI response in message thread

### Test 2: Quiz Mode
1. In message input, select "Quiz" mode
2. Paste some content
3. Click send
4. Should receive exactly 5 questions with 4 options each

### Test 3: Bilingual
1. Toggle "Bilingual" checkbox
2. Select any mode and send text
3. Response should include Vietnamese first, then English

### Test 4: Error Handling
1. Leave input empty and try to send
2. Should show validation error
3. Clear input and try again with valid text
4. Should work normally

---

## Next Steps (Optional)

1. **Add text selection to DocumentViewer**:
   - Allow users to select text in PDF
   - Show AIActions component above selection
   - Direct the action to AIChatPanel

2. **Add flashcard generation**:
   - Extend quiz mode to also generate flashcards
   - Store flashcards in a list
   - Display in FlashcardCard component

3. **Add document summarization on upload**:
   - After document upload, auto-generate summary
   - Show summary in document view
   - Let user regenerate

4. **Add multi-language support**:
   - Extend bilingual to support more languages
   - Add language selector in top nav

---

## Quick Reference: Importing AI Functions

```typescript
// In any "use client" component:
import { 
  callAI,
  summarizeContent,  // (text: string, bilingual: bool) => Promise<AIResponse | APIError>
  explainContent,    // (text: string, bilingual: bool) => Promise<AIResponse | APIError>
  generateQuiz,      // (text: string, bilingual: bool) => Promise<AIResponse | APIError>
  isAPIError,        // (response: any) => boolean
} from "@/lib/ai";
```

---

All files are production-ready for your 3-day MVP! 🚀
