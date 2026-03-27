"use client";
// Sidebar: Collapsible left navigation rail (Vietnamese UI)
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Library, Layers, Settings, FileText, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { viTranslations } from "@/lib/translations";

const navItems = [
  { href: "/dashboard", label: viTranslations.labels.dashboard, icon: LayoutDashboard },
  { href: "/library", label: viTranslations.labels.library, icon: Library },
  { href: "/flashcards", label: viTranslations.labels.flashcards, icon: Layers },
];

const recentDocs = [
  { id: "paper-001", title: "Ôn Tập Mạng Nơ-ron" },
  { id: "paper-002", title: "Giới Thiệu Tính Toán Lượng Tử" },
  { id: "paper-003", title: "Báo Cáo Về Biến Đổi Khí Hậu" },
];

interface SidebarProps { isOpen: boolean; onToggle: () => void; }

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className={cn(
      "h-screen flex flex-col border-r border-border bg-white transition-all duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
      isOpen ? "w-60" : "w-16"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-border shrink-0">
        <div onClick={() => router.push('/dashboard')} className="cursor-pointer flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary shrink-0" />
          {isOpen && <span className="font-semibold text-lg tracking-tight">StudyAI</span>}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto custom-scrollbar" role="navigation">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} title={!isOpen ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition-all duration-[120ms]",
                isActive ? "bg-primary-50 text-primary font-medium" : "text-text-secondary hover:bg-slate-50"
              )}>
              <item.icon className="w-5 h-5 shrink-0" />
              {isOpen && <span className="text-sm truncate">{item.label}</span>}
            </Link>
          );
        })}

        {/* Recent Docs */}
        {isOpen && (
          <div className="pt-6">
            <p className="px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Gần đây</p>
            {recentDocs.map((doc) => (
              <Link key={doc.id} href={`/doc/${doc.id}`}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm rounded-[8px] transition-colors duration-[120ms]",
                  pathname === `/doc/${doc.id}` ? "text-primary bg-primary-50" : "text-text-secondary hover:bg-slate-50"
                )}>
                <FileText className="w-4 h-4 shrink-0" />
                <span className="truncate">{doc.title}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-2 space-y-1 shrink-0">
        <Link href="/settings" title={!isOpen ? viTranslations.labels.settings : undefined}
          className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-slate-50 rounded-[12px] transition-colors duration-[120ms]">
          <Settings className="w-5 h-5 shrink-0" />
          {isOpen && <span className="text-sm">{viTranslations.labels.settings}</span>}
        </Link>
        <button onClick={onToggle} aria-label={isOpen ? "Thu gọn thanh bên" : "Mở rộng thanh bên"}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-text-secondary hover:bg-slate-50 rounded-[12px] transition-colors duration-[120ms]">
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          {isOpen && <span className="text-sm">Thu gọn</span>}
        </button>
      </div>
    </aside>
  );
}
