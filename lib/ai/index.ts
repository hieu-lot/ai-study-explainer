// Export all AI utilities for clean imports
export { buildPrompt, validateQuizResponse, formatQuizResponse } from "./promptBuilder";
export {
  summarizeContent,
  explainContent,
  generateQuiz,
  isAPIError,
} from "./client";

export type AIMode = "summarize" | "explain" | "quiz";
export type { ChatResponse } from "./client";
