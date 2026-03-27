/**
 * AI Service Client
 * Calls Next.js API route which securely handles OpenAI requests
 */

export interface ChatResponse {
  success: boolean;
  mode: "summarize" | "explain" | "quiz";
  bilingual: boolean;
  output: string;
}

interface APIError {
  error: string;
}

/**
 * Call the Next.js API route (server-side OpenAI)
 */
async function callAI(
  input: string,
  mode: "summarize" | "explain" | "quiz",
  bilingual: boolean,
  documentText?: string,
  documentId?: string  // 🔥 Pass document ID for history linking
): Promise<ChatResponse | APIError> {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
        mode,
        bilingual,
        documentText,
        documentId,  // 🔥 Include document ID in request
      }),
    });

    const contentType = response.headers.get("content-type") || "";
    const rawText = await response.text();

    let data: any = null;
    if (contentType.includes("application/json")) {
      try {
        data = JSON.parse(rawText);
      } catch {
        return {
          error: "Server returned invalid JSON",
        };
      }
    } else {
      return {
        error: `Server returned non-JSON response: ${rawText.slice(0, 200)}`,
      };
    }

    if (!response.ok) {
      return { error: data?.error || "Unknown error occurred" };
    }

    return data as ChatResponse;
  } catch (error) {
    return {
      error: `Network error: ${error instanceof Error ? error.message : "Unknown error"
        }`,
    };
  }
}

/**
 * Summarize content
 */
export async function summarizeContent(
  documentId: string,
  content: string,
  bilingual: boolean = false,
  documentText?: string
): Promise<ChatResponse | APIError> {
  return callAI(content, "summarize", bilingual, documentText, documentId);  // 🔥 Pass documentId
}

/**
 * Explain content
 */
export async function explainContent(
  documentId: string,
  content: string,
  bilingual: boolean = false,
  documentText?: string
): Promise<ChatResponse | APIError> {
  return callAI(content, "explain", bilingual, documentText, documentId);  // 🔥 Pass documentId
}

/**
 * Generate quiz from content
 */
export async function generateQuiz(
  documentId: string,
  content: string,
  bilingual: boolean = false,
  documentText?: string
): Promise<ChatResponse | APIError> {
  return callAI(content, "quiz", bilingual, documentText, documentId);  // 🔥 Pass documentId
}

/**
 * Type guard to check if response is an error
 */
export function isAPIError(
  response: ChatResponse | APIError
): response is APIError {
  return "error" in response && !("output" in response);
}