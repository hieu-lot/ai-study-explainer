"use client";
// Library: Document management with search, folders, tags, grid/list toggle, AI actions.
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Plus, Search, Grid3X3, List, Folder, FileText, Clock, Sparkles, Loader, X } from "lucide-react";
import AIActions from "@/components/AIActions";
import UploadDropzone from "@/components/UploadDropzone";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const folders = ["Tất cả tài liệu", "Tài liệu học tập", "Nghiên cứu", "Ghi chú cá nhân"];
const tags = ["Machine Learning", "Biology", "Physics", "Ethics"];

interface BackendDocument {
  id: string;
  original_name: string;
  url: string;
  created_at: string;
}

export default function LibraryPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeFolder, setActiveFolder] = useState("All Documents");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiText, setAiText] = useState("");
  const [bilingual, setBilingual] = useState(false);
  const [documents, setDocuments] = useState<BackendDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const loadDocuments = useCallback(async () => {
    try {
      const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;
      if (!username) {
        setDocuments([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/documents?user_id=${encodeURIComponent(username)}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load documents from backend
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const isReady = useAuth();

  if (!isReady) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">Đang tải...</div>
    );
  }

  const displayDocs = documents.map((doc) => ({
    id: doc.id,
    title: doc.original_name,
    lastOpened: new Date(doc.created_at).toLocaleDateString(),
  }));

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => setShowUpload((v) => !v)} className="btn-gradient text-white text-sm font-medium px-4 py-2.5 rounded-[12px] flex items-center gap-2">{showUpload ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}{showUpload ? "Đóng" : "Tải lên"}</button>
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input type="text" placeholder="Tìm kiếm tài liệu…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 border border-border rounded-[12px] text-sm outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex items-center gap-1 border border-border rounded-[8px] p-0.5">
          <button onClick={() => setView("grid")} className={cn("p-2 rounded-[6px]", view === "grid" ? "bg-slate-100" : "hover:bg-slate-50")}><Grid3X3 className="w-4 h-4" /></button>
          <button onClick={() => setView("list")} className={cn("p-2 rounded-[6px]", view === "list" ? "bg-slate-100" : "hover:bg-slate-50")}><List className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Upload panel */}
      {showUpload && (
        <UploadDropzone className="max-w-lg mx-auto" />
      )}

      {/* AI Actions Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-[16px] p-4 border border-primary/10 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Phân tích nhanh bằng AI</h3>
        </div>
        <input
          type="text"
          value={aiText}
          onChange={(e) => setAiText(e.target.value)}
          placeholder="Dán nội dung để AI phân tích..."
          className="w-full h-10 px-4 border border-border rounded-[12px] text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={bilingual}
              onChange={(e) => setBilingual(e.target.checked)}
              className="w-3.5 h-3.5"
            />
            <span className="text-text-secondary font-medium">Song ngữ</span>
          </label>
          {aiText && (
            <AIActions
              selectedText={aiText}
              bilingual={bilingual}
              onResult={() => setAiText("")}
            />
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button key={tag} onClick={() => setActiveTags((p) => p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag])}
            className={cn("px-3 py-1 text-xs font-medium rounded-full border transition-all duration-[120ms]",
              activeTags.includes(tag) ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-border hover:border-primary/50")}>{tag}</button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        <div className="hidden md:block w-48 shrink-0 space-y-1">
          {folders.map((f) => (
            <button key={f} onClick={() => setActiveFolder(f)}
              className={cn("w-full flex items-center gap-2 px-3 py-2 text-sm rounded-[12px] transition-colors duration-[120ms] text-left",
                activeFolder === f ? "bg-primary-50 text-primary font-medium" : "text-text-secondary hover:bg-slate-50")}>
              <Folder className="w-4 h-4 shrink-0" />{f}
            </button>
          ))}
        </div>
        <div className={cn("flex-1", view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-3")}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : displayDocs.length > 0 ? (
            displayDocs.map((doc) => (
              <Link key={doc.id} href={`/doc/${doc.id}`}
                className={cn("group block bg-white border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-[120ms]",
                  view === "grid" ? "p-5 rounded-[16px]" : "flex items-center gap-4 p-4 rounded-[12px]")}>
                <div className="w-10 h-10 bg-primary-50 rounded-[12px] flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-primary" /></div>
                <div className={view === "grid" ? "mt-3" : ""}>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">{doc.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{doc.lastOpened}</span></div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-text-secondary text-sm">Chưa có tài liệu. Nhấn &quot;Tải lên&quot; để bắt đầu!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
