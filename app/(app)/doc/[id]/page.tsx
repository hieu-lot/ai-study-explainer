"use client";

import { useState, useCallback, useEffect } from "react";
import { Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import AIChatPanel from "@/components/AIChatPanel";
import AIActions from "@/components/AIActions";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const DocumentViewer = dynamic(
  () => import("@/components/DocumentViewer"),
  { ssr: false }
);

export default function StudyWorkspacePage({ params }: { params: { id: string } }) {
  const documentId = params.id;

  const [highlightPage, setHighlightPage] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [notes, setNotes] = useState<string[]>([]);
  const [contentInput, setContentInput] = useState("");
  const [showAIActions, setShowAIActions] = useState(false);
  const [bilingual, setBilingual] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleCitationClick = useCallback((page: number) => {
    setHighlightPage(page);
    setTimeout(() => setHighlightPage(null), 1500);
  }, []);

  const handleAIResult = useCallback((result: string) => {
    setContentInput("");
    setShowAIActions(false);
    setChatOpen(true);
  }, []);

  useEffect(() => {
    const viewerUrl = `${API_BASE}/${documentId}/file`;
    console.log("Viewer URL:", viewerUrl);
    setDocumentUrl(viewerUrl);
    setLoading(false);
  }, [API_BASE, documentId]);

  const isReady = useAuth();

  if (!isReady) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] overflow-hidden relative">
      <div className="flex flex-1 overflow-hidden gap-3 p-3">
        {/* Document Viewer */}
        <div
          className={cn(
            "flex flex-col flex-1 min-w-0 transition-all duration-[240ms]",
            chatOpen ? "lg:pr-1" : ""
          )}
        >
          <div className="flex-1 rounded-[16px] border border-border/50 overflow-hidden">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-white">
                <div>Loading document...</div>
              </div>
            ) : (
              <DocumentViewer url={documentUrl} />
            )}
          </div>

          {/* Quick AI */}
          <div className="mt-3 bg-white rounded-[12px] border border-border/50 p-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <Sparkles className="w-4 h-4 text-primary" />
                Quick AI Action
              </label>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={bilingual}
                  onChange={(e) => setBilingual(e.target.checked)}
                  className="w-3.5 h-3.5"
                />
                <span className="text-text-secondary">Bilingual</span>
              </label>
            </div>

            <textarea
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              placeholder="Paste or type content here..."
              className="w-full h-20 px-4 py-2 bg-white border border-border rounded-[12px] text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />

            {contentInput && !showAIActions && (
              <button
                onClick={() => setShowAIActions(true)}
                className="w-full px-4 py-2 bg-primary text-white text-sm rounded-lg"
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                Show AI Actions
              </button>
            )}

            {showAIActions && contentInput && (
              <AIActions
                selectedText={contentInput}
                bilingual={bilingual}
                onResult={handleAIResult}
                className="w-full"
              />
            )}
          </div>
        </div>

        {/* Chat */}
        {chatOpen && (
          <div className="hidden lg:flex w-[380px] shrink-0">
            <AIChatPanel
              documentId={documentId}
              initialMessages={[]}
              onCitationClick={handleCitationClick}
              notes={notes}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}