"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface Citation { page: number; text: string; }

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations: Citation[];
}

interface AIChatPanelProps {
  documentId: string;
  initialMessages?: ChatMessage[];
  onCitationClick?: (page: number) => void;
  notes?: string[];
  className?: string;
  onDocumentTextChange?: (text: string) => void;
}

export default function AIChatPanel({
  documentId,
  initialMessages = [],
  onCitationClick,
  notes = [],
  className,
  onDocumentTextChange
}: AIChatPanelProps) {

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, generating]);

  // Load history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`/api/history/${documentId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.history) {
            const historyMessages: ChatMessage[] = data.history.flatMap((item: any) => [
              {
                id: `h-${item.id}-q`,
                role: "user",
                content: item.question,
                citations: [],
              },
              {
                id: `h-${item.id}-a`,
                role: "assistant",
                content: item.answer,
                citations: [],
              },
            ]);
            setMessages(historyMessages);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (documentId && !initialMessages.length) {
      loadHistory();
    }
  }, [documentId]);

  const handleSend = async () => {
    if (!input.trim() || generating) return;

    const text = input.trim();
    setInput("");

    setMessages(prev => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content: text, citations: [] }
    ]);

    setGenerating(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, documentId })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.answer || "No response",
          citations: []
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          content: "Network error",
          citations: []
        }
      ]);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={cn("h-full min-h-0 flex flex-col bg-white", className)}>
      
      {/* MESSAGES */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-lg px-4 py-2 text-sm",
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {generating && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader className="w-4 h-4 animate-spin" />
              AI is thinking...
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* INPUT */}
      <div className="p-3 border-t bg-white">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleSend())}
            className="flex-1 border rounded-lg p-3 text-sm"
            placeholder="Ask something..."
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm p-2">
          {error}
        </div>
      )}
    </div>
  );
}