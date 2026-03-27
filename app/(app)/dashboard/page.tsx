"use client";
// Dashboard: Vietnamese UI - Upload zone, recent documents grid, AI quick actions, study stats
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Flame, Layers, FileText, Clock, Sparkles } from "lucide-react";
import UploadDropzone from "@/components/UploadDropzone";
import AIActions from "@/components/AIActions";
import { mockRecentDocs, mockStats } from "@/lib/mock-data";
import { viTranslations } from "@/lib/translations";

export default function DashboardPage() {
  const [quickText, setQuickText] = useState("");
  const [bilingual, setBilingual] = useState(false);

  const isReady = useAuth();

  if (!isReady) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">Đang tải...</div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-10">
      {/* Upload */}
      <UploadDropzone onFileSelect={(f) => console.info("dashboard-upload", f.name)} />

      {/* Quick AI Actions */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-[16px] p-6 border border-primary/10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Trợ Lý AI Nhanh
        </h2>
        <div className="space-y-3">
          <textarea
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            placeholder="Dán nội dung ở đây để tóm tắt, giải thích hoặc tạo câu hỏi kiểm tra..."
            className="w-full h-24 px-4 py-3 bg-white border border-border rounded-[12px] text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow resize-none custom-scrollbar"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={bilingual}
                onChange={(e) => setBilingual(e.target.checked)}
                className="w-3.5 h-3.5"
              />
              <span className="text-text-secondary font-medium">Đầu Ra Lưỡng Ngữ</span>
            </label>
            {quickText && (
              <AIActions
                selectedText={quickText}
                bilingual={bilingual}
                onResult={(result) => {
                  setQuickText("");
                  console.log("AI Result:", result);
                }}
              />
            )}
          </div>
        </div>
      </section>

      {/* Recent Documents */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Tài Liệu Gần Đây</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockRecentDocs.map((doc) => (
            <Link key={doc.id} href={`/doc/${doc.id}`}
              className="group block p-5 bg-white rounded-[16px] border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-[120ms]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-50 rounded-[12px] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{doc.title}</p>
                  <p className="text-xs text-text-secondary">{doc.pages} trang</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-secondary"><Clock className="w-3 h-3" />{doc.lastOpened}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Study Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Thống Kê Học Tập</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {mockStats.map((stat, i) => (
            <div key={i} className="glass rounded-[16px] p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                {stat.icon === "flame" && <Flame className="w-6 h-6 text-orange-500" />}
                {stat.icon === "cards" && <Layers className="w-6 h-6 text-primary" />}
                {stat.icon === "docs" && <FileText className="w-6 h-6 text-secondary" />}
              </div>
              <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-sm text-text-secondary">{stat.label}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
