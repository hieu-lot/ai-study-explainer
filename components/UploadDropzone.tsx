"use client";
// UploadDropzone: Drag-and-drop file upload with Vietnamese UI
import { useState, useRef } from "react";
import { Upload, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { viTranslations } from "@/lib/translations";

interface UploadDropzoneProps { onFileSelect?: (file: File) => void; onDocumentTextLoaded?: (text: string) => void; className?: string; }

export default function UploadDropzone({ onFileSelect, onDocumentTextLoaded, className }: UploadDropzoneProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const handleUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;
      const uploadUrl = username ? `${API}/upload?user_id=${encodeURIComponent(username)}` : `${API}/upload`;

      // Use backend top-level upload endpoint
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      console.log("Upload result:", result);
      if (result?.url) console.log("Uploaded file accessible at:", result.url);
      if (result?.id) console.log("Uploaded document id:", result.id);

      if (result.error) {
        alert(result.error);
        return;
      }

      try {
        const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;

        if (result?.id && username) {
          const saveRes = await fetch(`/api/documents`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: result.id,
              name: result.url,
              content: result.content,
              username,
            }),
          });

          const saveJson = await saveRes.json();
          console.log("Saved document metadata response:", saveJson);
          if (!saveRes.ok || !saveJson?.success) {
            console.error("Failed to save document metadata:", saveJson);
          }
        }
      } catch (err) {
        console.error("Failed to save document metadata:", err);
      }

      onDocumentTextLoaded?.(result.content);
      if (result?.id) router.replace(`/doc/${result.id}`);
      else router.replace(`/library`);
      onFileSelect?.(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className={cn("border-2 border-dashed rounded-[16px] p-8 text-center cursor-pointer transition-all duration-[240ms] relative overflow-hidden",
        isDragging ? "border-primary bg-primary-50 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-slate-50", 
        isUploading ? "opacity-70 pointer-events-none" : "",
        className)}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
      onClick={() => inputRef.current?.click()} role="button" tabIndex={0} aria-label="Tải lên một tài liệu"
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}>
      <input ref={inputRef} type="file" accept=".pdf,.docx" onChange={(e) => {
        const file = e.target.files?.[0]; if (file) handleUpload(file);
      }} className="hidden" />
      <div className="flex flex-col items-center gap-3">
        {isUploading ? (
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        ) : isDragging ? (
          <FileUp className="w-10 h-10 text-primary animate-bounce" />
        ) : (
          <Upload className="w-10 h-10 text-text-secondary" />
        )}
        <div>
          <p className="font-medium text-text-primary">
            {isUploading ? "Đang tải lên..." : isDragging ? "Thả tệp của bạn ở đây" : "Thả tệp PDF hoặc DOCX hoặc nhấp để duyệt"}
          </p>
          <p className="text-sm text-text-secondary mt-1">PDF hoặc DOCX tối đa 50 MB</p>
        </div>
      </div>
      {error && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
          {error}
        </div>
      )}
    </div>
  );
}
