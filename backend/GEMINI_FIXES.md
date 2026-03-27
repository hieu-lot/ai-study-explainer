# Gemini API Configuration & 403 Error Fixes

## Summary of Changes

This document outlines the root cause of the 403 Forbidden error and the fixes applied.

### Root Cause
**The model name `gemini-pro` is outdated** in the current `google-generativeai` SDK.
- **Old:` `gemini-pro` (deprecated)
- **Current:** `gemini-1.5-flash`, `gemini-1.5-pro` (free tier available)
- **Error:** When requesting a non-existent model, Google returns 403 Forbidden (permission denied on invalid resource)

### Configuration Standardization

All Gemini API calls now use:
- **Environment variable:** `GOOGLE_API_KEY` (single source)
- **Loading method:** `load_dotenv()` in `main.py`
- **Access method:** `os.getenv("GOOGLE_API_KEY")` with validation
- **Model:** `gemini-1.5-flash` (current, supported, free tier)
- **Configuration:** `genai.configure(api_key=api_key)` at module startup (once only)

### Files Modified

| File | Change |
|------|--------|
| **services/ai_service.py** | Updated model name from `gemini-pro` → `gemini-1.5-flash`; Added comprehensive error handling for 403, 404, auth errors; Added debug logging; Eliminated duplicate model instantiation |
| **routers/chat.py** | Integrated `ai_service.ask()`; Added error handling with fallback to stub; Added logging |
| **routers/flashcards.py** | Integrated `ai_service.generate_flashcards()`; Added error handling with fallback to stub; Added logging |
| **routers/gemini_test.py** | **NEW:** Dedicated minimal test endpoint for isolating Gemini issues |
| **main.py** | Added `import logging`; Set up `logging.basicConfig()` with DEBUG level; Registered `gemini_test` router; Added startup logging |
| **.env** | ✓ Already correct: `GOOGLE_API_KEY=AIzaSyCG7-0VWjrImfmUhMz6aJAI7PN_4ukNb30` |

### Key Improvements

1. **Single Configuration Path**: All Gemini setup happens once in `ai_service.py` at module import
2. **Error Clarity**: Specific exception handling for:
   - `403 PermissionDenied` → API key invalid/restricted
   - `404 NotFound` → Model doesn't exist
   - `401 Unauthenticated` → Invalid credentials
   - `429 ResourceExhausted` → Quota/rate limit exceeded
3. **Debug Logging**: Safe logging of key existence (first/last 4 chars only) and model name
4. **Test Endpoint**: `/api/v1/gemini-test/test` route for isolated testing (no side effects)
5. **Graceful Fallback**: Chat/flashcards endpoints fall back to stub responses if Gemini unavailable

### How to Test

#### Option 1: Use Standalone Test Script
```bash
cd backend
python test_gemini.py
```
This tests the API key, SDK, configuration, and a simple call without starting the server.

#### Option 2: Use Test Endpoint
```bash
cd backend
uvicorn main:app --reload --port 8000

# In another terminal:
curl -X POST http://localhost:8000/api/v1/gemini-test/test \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Say hello"}'
```

Expected successful response:
```json
{
  "success": true,
  "message": "✓ Gemini API call succeeded!",
  "model": "gemini-1.5-flash",
  "api_key_exists": true,
  "response_preview": "Hello!"
}
```

#### Option 3: Use Chat Endpoint
```bash
curl -X POST http://localhost:8000/api/v1/chat/ask \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "test-doc",
    "query": "What is machine learning?",
    "level": "Beginner"
  }'
```

### Debugging 403 Errors

If you still see `403 Forbidden`:

1. **Verify API Key**
   - Open `backend/.env` and confirm the key is present
   - Ensure no extra spaces or line breaks

2. **Check Google Cloud Setup**
   - Go to https://console.cloud.google.com
   - Ensure the API key is for a project with Generative AI API enabled
   - Check that billing is configured

3. **Verify Model Access**
   - The API key must have permission to access `gemini-1.5-flash`
   - If this key is restricted to specific models, ensure `gemini-1.5-flash` is in the allowlist

4. **Run the standalone test**
   - `python test_gemini.py` will show exactly where the failure occurs
   - Logs will show the exact error from Google

5. **Check Logs**
   ```bash
   cd backend
   uvicorn main:app --reload 2>&1 | grep -i "gemini\|error\|403"
   ```

### Running the Backend

```bash
cd backend
pip install -r requirements.txt  # If not already done
uvicorn main:app --reload --port 8000
```

The backend will:
1. Load `.env` file
2. Print: `✓ GOOGLE_API_KEY loaded: AIzaSy...4ukNb30`
3. Print: `ℹ Gemini model set to: gemini-1.5-flash`
4. Start the FastAPI server
5. Be ready for requests at `http://localhost:8000`

### Environment

**SDK:** `google-generativeai>=0.3.0`  
**Model:** `gemini-1.5-flash` (current)  
**API Key Env Var:** `GOOGLE_API_KEY`  
**Configuration:** Loaded from `backend/.env` via `load_dotenv()`  

All errors are logged with DEBUG level by default. Use `logging` module to adjust as needed.
