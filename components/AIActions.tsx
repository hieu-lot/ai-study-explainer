"use client";
/**
 * AIActions: Quick action buttons to trigger AI features (Vietnamese UI)
 */

import { useState } from "react";
import { Sparkles, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { explainContent, summarizeContent, generateQuiz, isAPIError } from "@/lib/ai";
import { viTranslations } from "@/lib/translations";

interface AIActionsProps {
  selectedText: string;
  documentId?: string;
  onResult?: (result: string, mode: "summarize" | "explain" | "quiz") => void;
  bilingual?: boolean;
  className?: string;
  position?: "inline" | "floating";
}

export default function AIActions({
  selectedText,
  documentId = "default",
  onResult,
  bilingual = false,
  className,
  position = "inline",
}: AIActionsProps) {
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<"summarize" | "explain" | "quiz" | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // 🔥 FIX CORE
  const getSafeResult = (response: any): string => {
    if (!response) return "No response";

    // backend trả output
    if (response.output) {
      return typeof response.output === "string"
        ? response.output
        : JSON.stringify(response.output);
    }

    // fallback
    if (typeof response === "string") return response;
    if (response.error) return response.error;

    return JSON.stringify(response);
  };

  const handleAction = async (mode: "summarize" | "explain" | "quiz") => {
    if (!selectedText.trim()) return;

    setLoading(true);
    setActiveMode(mode);
    setResult(null);

    try {
      const response =
        mode === "summarize"
          ? await summarizeContent(documentId, selectedText, bilingual)
          : mode === "explain"
          ? await explainContent(documentId, selectedText, bilingual)
          : await generateQuiz(documentId, selectedText, bilingual);

      console.log("AI RESPONSE:", response);

      if (isAPIError(response)) {
        setResult(`Error: ${response.error}`);
      } else {
        const safeResult = getSafeResult(response);
        setResult(safeResult);
        onResult?.(safeResult, mode);
      }

      setShowResult(true);
    } catch (error) {
      console.error(error);
      setResult("Failed to process your request. Please try again.");
      setShowResult(true);
    } finally {
      setLoading(false);
      setActiveMode(null);
    }
  };

  if (result && showResult) {
    return (
      <div
        className={cn(
          "bg-white border border-border/50 rounded-[12px] p-4 shadow-lg",
          position === "floating" && "fixed z-50 max-w-md",
          className
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Kết Quả AI
          </h3>
          <button
            onClick={() => setShowResult(false)}
            className="text-text-secondary hover:text-text-primary text-xs font-medium"
          >
            ✕
          </button>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 text-sm leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap">
          {result}
        </div>

        <button
          onClick={() => {
            if (result) {
              navigator.clipboard.writeText(result);
              alert("Đã sao chép vào bảng tạm!");
            }
          }}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-primary bg-primary-50 hover:bg-primary-100 rounded-lg"
        >
          <Copy className="w-3.5 h-3.5" />
          Sao Chép Kết Quả
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-2 p-2 bg-white border border-border/50 rounded-[12px]",
        position === "floating" && "fixed z-50 shadow-lg",
        className
      )}
    >
      {(["summarize", "explain", "quiz"] as const).map((mode) => (
        <button
          key={mode}
          onClick={() => handleAction(mode)}
          disabled={loading || !selectedText.trim()}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg",
            loading && activeMode === mode
              ? "bg-primary text-white"
              : "bg-primary-50 text-primary hover:bg-primary-100 disabled:opacity-50"
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {viTranslations.modes[mode]}
          {loading && activeMode === mode && (
            <span className="animate-spin ml-0.5">⟳</span>
          )}
        </button>
      ))}
    </div>
  );
}