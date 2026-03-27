/**
 * AI Integration Code Examples
 * Copy-paste ready examples for different scenarios
 */

// ============================================================================
// EXAMPLE 1: Using AIActions Component with Document Selection
// ============================================================================
// File: app/(app)/doc/[id]/page.tsx (if you want to add text selection)

import { useState } from "react";
import AIActions from "@/components/AIActions";

export default function StudyWorkspacePage({ params }: { params: { id: string } }) {
  const [selectedText, setSelectedText] = useState("");

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden relative">
      {/* ... existing layout ... */}

      {/* Show AIActions if text is selected */}
      {selectedText && (
        <div className="fixed bottom-6 right-6 z-40">
          <AIActions
            selectedText={selectedText}
            bilingual={false}
            onResult={(result, mode) => {
              console.log(`${mode} result:`, result);
              setSelectedText("");
              // Optionally open chat with result
            }}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Simple AI Summary Component (Standalone)
// ============================================================================
// File: components/TextSummarizer.tsx

"use client";

import { useState } from "react";
import { Sparkles, Loader } from "lucide-react";
import { summarizeContent, isAPIError } from "@/lib/ai";
import { cn } from "@/lib/utils";

interface TextSummarizerProps {
  text: string;
  bilingual?: boolean;
  className?: string;
}

export default function TextSummarizer({
  text,
  bilingual = false,
  className,
}: TextSummarizerProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const response = await summarizeContent(text, bilingual);

    if (isAPIError(response)) {
      setError(response.error);
    } else {
      setResult(response.output);
    }

    setLoading(false);
  };

  return (
    <div className={cn("bg-white border border-border/50 rounded-[12px] p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Summary
        </h3>
      </div>

      {!result ? (
        <button
          onClick={handleSummarize}
          disabled={loading || !text.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-opacity"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Summarize
            </>
          )}
        </button>
      ) : (
        <div>
          <div className="bg-slate-50 rounded-lg p-3 text-sm leading-relaxed mb-3 max-h-64 overflow-y-auto whitespace-pre-wrap">
            {result}
          </div>
          <button
            onClick={() => setResult(null)}
            className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-sm font-medium rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

// Usage:
// <TextSummarizer text="Your text here" bilingual={true} />

// ============================================================================
// EXAMPLE 3: Quiz Generator Component
// ============================================================================
// File: components/QuizGenerator.tsx

"use client";

import { useState } from "react";
import { generateQuiz, isAPIError } from "@/lib/ai";
import { Sparkles, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizGeneratorProps {
  documentContent: string;
  bilingual?: boolean;
  className?: string;
  onQuizGenerated?: (quiz: string) => void;
}

export default function QuizGenerator({
  documentContent,
  bilingual = false,
  className,
  onQuizGenerated,
}: QuizGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuiz = async () => {
    if (!documentContent.trim()) {
      setError("No content to generate quiz from");
      return;
    }

    setLoading(true);
    setError(null);

    const response = await generateQuiz(documentContent, bilingual);

    if (isAPIError(response)) {
      setError(response.error);
    } else {
      setQuiz(response.output);
      onQuizGenerated?.(response.output);
    }

    setLoading(false);
  };

  return (
    <div className={cn("bg-white border border-border/50 rounded-[12px] p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Practice Quiz
        </h3>
      </div>

      {!quiz ? (
        <button
          onClick={handleGenerateQuiz}
          disabled={loading || !documentContent.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-opacity"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Generating Questions...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Quiz (5 Questions)
            </>
          )}
        </button>
      ) : (
        <div>
          <div className="bg-slate-50 rounded-lg p-4 text-sm leading-relaxed mb-3 max-h-96 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
            {quiz}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setQuiz(null)}
              className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-sm font-medium rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(quiz)}
              className="flex-1 px-4 py-2 bg-primary/90 hover:bg-primary text-white text-sm font-medium rounded-lg transition-colors"
            >
              Copy Quiz
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

// Usage:
// <QuizGenerator documentContent="Document text here" bilingual={true} />

// ============================================================================
// EXAMPLE 4: Explain Button in Document Toolbar
// ============================================================================
// File: components/DocumentToolbar.tsx (New Component)

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { explainContent, isAPIError } from "@/lib/ai";
import { Sparkles, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentToolbarProps {
  selectedText: string;
  onExplanation?: (explanation: string) => void;
  onOpenChat?: () => void;
}

export default function DocumentToolbar({
  selectedText,
  onExplanation,
  onOpenChat,
}: DocumentToolbarProps) {
  const [loading, setLoading] = useState(false);
  const [bilingual, setBilingual] = useState(false);

  const handleExplain = async () => {
    if (!selectedText.trim()) return;

    setLoading(true);
    const response = await explainContent(selectedText, bilingual);

    if (!isAPIError(response)) {
      onExplanation?.(response.output);
      onOpenChat?.();
    }

    setLoading(false);
  };

  if (!selectedText.trim()) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 bg-white border border-border/50 rounded-[12px] p-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex-1 text-sm text-text-secondary">
          Selected: "{selectedText.slice(0, 50)}{selectedText.length > 50 ? "..." : ""}"
        </div>
        <label className="flex items-center gap-1.5 text-xs">
          <input
            type="checkbox"
            checked={bilingual}
            onChange={(e) => setBilingual(e.target.checked)}
            className="w-3.5 h-3.5"
          />
          Bilingual
        </label>
        <button
          onClick={handleExplain}
          disabled={loading}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg",
            "bg-primary text-white hover:bg-primary/90",
            "disabled:opacity-50 transition-colors"
          )}
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Explaining...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Explain
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Hooks Pattern for Reusability
// ============================================================================
// File: hooks/useAI.ts

import { useState, useCallback } from "react";
import {
  summarizeContent,
  explainContent,
  generateQuiz,
  isAPIError,
} from "@/lib/ai";

interface UseAIReturn {
  loading: boolean;
  error: string | null;
  result: string | null;
  summarize: (text: string, bilingual: boolean) => Promise<void>;
  explain: (text: string, bilingual: boolean) => Promise<void>;
  quiz: (text: string, bilingual: boolean) => Promise<void>;
  clear: () => void;
}

export function useAI(): UseAIReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const summarize = useCallback(
    async (text: string, bilingual: boolean) => {
      setLoading(true);
      setError(null);
      const response = await summarizeContent(text, bilingual);
      if (isAPIError(response)) {
        setError(response.error);
      } else {
        setResult(response.output);
      }
      setLoading(false);
    },
    []
  );

  const explain = useCallback(
    async (text: string, bilingual: boolean) => {
      setLoading(true);
      setError(null);
      const response = await explainContent(text, bilingual);
      if (isAPIError(response)) {
        setError(response.error);
      } else {
        setResult(response.output);
      }
      setLoading(false);
    },
    []
  );

  const quiz = useCallback(
    async (text: string, bilingual: boolean) => {
      setLoading(true);
      setError(null);
      const response = await generateQuiz(text, bilingual);
      if (isAPIError(response)) {
        setError(response.error);
      } else {
        setResult(response.output);
      }
      setLoading(false);
    },
    []
  );

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { loading, error, result, summarize, explain, quiz, clear };
}

// Usage:
// const { loading, error, result, explain } = useAI();
// await explain("text", true);

// ============================================================================
// EXAMPLE 6: Dropdown Menu for Quick Actions
// ============================================================================
// File: components/AIQuickMenu.tsx

"use client";

import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { summarizeContent, explainContent, generateQuiz, isAPIError } from "@/lib/ai";
import { cn } from "@/lib/utils";

interface AIQuickMenuProps {
  selectedText: string;
  onResult?: (result: string, mode: string) => void;
  className?: string;
}

export default function AIQuickMenu({
  selectedText,
  onResult,
  className,
}: AIQuickMenuProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<string | null>(null);

  const modes = [
    { label: "Summarize", mode: "summarize", fn: summarizeContent },
    { label: "Explain", mode: "explain", fn: explainContent },
    { label: "Quiz", mode: "quiz", fn: generateQuiz },
  ];

  const handleAction = async (fn: Function, mode: string) => {
    if (!selectedText.trim()) return;
    setLoading(true);
    setActiveMode(mode);

    const response = await fn(selectedText, false);
    if (!isAPIError(response)) {
      onResult?.(response.output, mode);
    }

    setLoading(false);
    setActiveMode(null);
    setOpen(false);
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        AI Tools
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50">
          {modes.map((m) => (
            <button
              key={m.mode}
              onClick={() => handleAction(m.fn, m.mode)}
              disabled={loading || !selectedText.trim()}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50 border-b last:border-b-0"
            >
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// All examples are production-ready! Mix and match as needed.
// ============================================================================
