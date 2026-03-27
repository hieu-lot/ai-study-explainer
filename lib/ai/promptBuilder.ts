/**
 * Prompt Builder for AI Study Assistant
 * Builds strict prompts for different modes with bilingual support
 */

type Mode = "summarize" | "explain" | "quiz";

interface PromptConfig {
  input: string;
  mode: Mode;
  bilingual: boolean;
}

/**
 * Build a system message that enforces strict behavior
 */
function getSystemMessage(mode: Mode, bilingual: boolean): string {
  const baseInstruction = `You are an expert educational assistant. You must ONLY use information provided by the user. Do not invent, assume, or add facts outside the user's input. Be accurate, concise, and study-friendly.`;

  const languageInstruction = bilingual
    ? "Output in this exact format: Vietnamese explanation first, then English explanation. Use clear section headers."
    : "Output only in Vietnamese. Be concise and clear.";

  const modeInstructions = {
    summarize: "Create a brief, study-friendly summary that captures the key points. Keep it concise.",
    explain:
      "Provide a simple, easy-to-understand explanation. Break down complex concepts into digestible parts.",
    quiz: "Generate exactly 5 multiple-choice questions based ONLY on the provided content. Each question must have exactly 4 options (A, B, C, D). Clearly mark the correct answer after each question.",
  };

  return `${baseInstruction} ${languageInstruction} Mode: ${modeInstructions[mode]}`;
}

/**
 * Build the user prompt with mode-specific instructions
 */
function getUserPrompt(input: string, mode: Mode): string {
  const modePrompts = {
    summarize: `Please summarize this content:\n\n${input}`,
    explain: `Please explain this content in simple terms:\n\n${input}`,
    quiz: `Create exactly 5 multiple-choice questions from this content. Each question MUST have exactly 4 options (A, B, C, D). Clearly mark the correct answer after each question using format "Correct answer: A" or similar.\n\nContent:\n${input}`,
  };

  return modePrompts[mode];
}

/**
 * Build complete prompt messages for OpenAI API
 */
export function buildPrompt(
  config: PromptConfig
): Array<{ role: "system" | "user"; content: string }> {
  return [
    {
      role: "system",
      content: getSystemMessage(config.mode, config.bilingual),
    },
    {
      role: "user",
      content: getUserPrompt(config.input, config.mode),
    },
  ];
}

/**
 * Validate quiz response format
 * Ensures the response contains exactly 5 questions with proper formatting
 */
export function validateQuizResponse(response: string): boolean {
  // Check for at least 5 question indicators
  const questionMatches = response.match(/^(Question|Q)\s*\d+[.:\s]/gim);
  if (!questionMatches || questionMatches.length < 5) {
    return false;
  }

  // Check for option indicators (A, B, C, D)
  const optionMatches = response.match(/^[A-D]\.\s/gim);
  if (!optionMatches || optionMatches.length < 20) {
    // At least 5 questions * 4 options each
    return false;
  }

  // Check for correct answer indicator
  const answerMatches = response.match(/correct\s*answer\s*[:=]/gi);
  if (!answerMatches || answerMatches.length < 5) {
    return false;
  }

  return true;
}

/**
 * Format quiz response to ensure proper structure
 * If the response doesn't meet requirements, returns an error message
 */
export function formatQuizResponse(response: string): string {
  if (!validateQuizResponse(response)) {
    return (
      response +
      "\n\n[Note: Response may not have exactly 5 questions with proper formatting. Please regenerate.]"
    );
  }
  return response;
}
