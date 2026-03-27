"use client";
// SearchBar: Cmd+K spotlight overlay with Vietnamese UI
import { useEffect, useRef, useState } from "react";
import { Search, FileText, Layers, StickyNote, X } from "lucide-react";
import { viTranslations } from "@/lib/translations";

interface SearchBarProps { isOpen: boolean; onClose: () => void; }

const mockResults = [
  { icon: FileText, title: "Ôn Tập Mạng Nơ-ron", subtitle: "30 trang" },
  { icon: FileText, title: "Giới Thiệu Tính Toán Lượng Tử", subtitle: "15 trang" },
  { icon: Layers, title: "Bộ Thẻ Sinh Học 101", subtitle: "42 thẻ" },
  { icon: StickyNote, title: "Ghi Chú Nghiên Cứu: Đạo Đức ML", subtitle: "Cập nhật 2 ngày trước" },
];

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (isOpen) { inputRef.current?.focus(); setQuery(""); } }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = mockResults.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[16px] shadow-lg border border-border animate-in">
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search className="w-5 h-5 text-text-secondary shrink-0" />
          <input ref={inputRef} type="text" placeholder="Tìm kiếm tài liệu, thẻ ghi nhớ, ghi chú…"
            value={query} onChange={(e) => setQuery(e.target.value)}
            className="flex-1 h-12 bg-transparent outline-none text-sm placeholder:text-text-secondary" />
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100"><X className="w-4 h-4 text-text-secondary" /></button>
        </div>
        <ul className="max-h-72 overflow-y-auto py-2">
          {filtered.map((r, i) => (
            <li key={i}>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                onClick={() => { console.info("search-navigate", r.title); onClose(); }}>
                <r.icon className="w-4 h-4 text-text-secondary shrink-0" />
                <div><p className="text-sm font-medium">{r.title}</p><p className="text-xs text-text-secondary">{r.subtitle}</p></div>
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className="px-4 py-6 text-center text-sm text-text-secondary">No results found.</li>}
        </ul>
      </div>
    </div>
  );
}
