"use client";
// TopNav: 56px top bar with logo nav, notifications, user avatar (Vietnamese UI)
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Menu, LogOut, Settings, History, User } from "lucide-react";
import Link from "next/link";
import { viTranslations } from "@/lib/translations";

interface TopNavProps { title: string; onMenuClick?: () => void; onSearchClick?: () => void; }

const FAKE_NOTIFICATIONS = [
  { id: 1, text: "Document uploaded successfully", time: "2 min ago" },
  { id: 2, text: "AI finished analyzing your file", time: "5 min ago" },
  { id: 3, text: "New feature: Quiz mode available", time: "1 hour ago" },
];

const FAKE_HISTORY = [
  { id: 1, query: "Explain blockchain technology", time: "Today" },
  { id: 2, query: "Summarize macroeconomics notes", time: "Yesterday" },
  { id: 3, query: "Generate quiz on Python basics", time: "2 days ago" },
  { id: 4, query: "Explain quantum computing", time: "1 week ago" },
  { id: 5, query: "Summarize world history chapter 5", time: "2 weeks ago" },
];

export default function TopNav({ title, onMenuClick, onSearchClick }: TopNavProps) {
  const router = useRouter();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("isLoggedIn");
      const name = localStorage.getItem("username");
      setIsLoggedIn(Boolean(saved));
      setUsername(name);
    } catch (e) {
      setIsLoggedIn(false);
      setUsername(null);
    }
  }, []);

  return (
    <>
      <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button onClick={onMenuClick} className="md:hidden p-2 rounded-[12px] hover:bg-slate-100 transition-colors duration-[120ms]" aria-label="Mở menu">
              <Menu className="w-5 h-5" />
            </button>
          )}
          {/* Removed duplicate branding; keep only workspace title if provided */}
          {/* no StudyAI text here to avoid duplicate branding with Sidebar */}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={onSearchClick} className="p-2.5 rounded-[12px] hover:bg-slate-100 transition-colors duration-[120ms]" aria-label="Tìm kiếm (Ctrl+K)" title="Ctrl+K">
            <Search className="w-5 h-5 text-text-secondary" />
          </button>

          {/* 🔔 Notification Bell Dropdown */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2.5 rounded-[12px] hover:bg-slate-100 transition-colors duration-[120ms] relative"
              aria-label="Thông báo"
            >
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-border p-2 z-50">
                <div className="mb-2 px-3 py-2 text-sm font-semibold text-text-primary">Thông Báo</div>
                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {FAKE_NOTIFICATIONS.map(notif => (
                    <div key={notif.id} className="px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                      <p className="text-sm text-text-primary">{notif.text}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 👤 Avatar Dropdown Menu */}
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
              className="w-8 h-8 rounded-full bg-indigo-500 text-white text-sm font-semibold flex items-center justify-center ml-1 hover:shadow-md transition-shadow duration-[120ms]"
              aria-label="Menu tài khoản"
            >
              {isLoggedIn ? (username ? username.charAt(0).toUpperCase() : "U") : "G"}
            </button>

            {avatarMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-text-primary">{isLoggedIn ? (username || "User") : "Guest"}</p>
                  <p className="text-xs text-text-secondary">{isLoggedIn ? username || "" : "Not logged in"}</p>
                </div>

                <div className="space-y-1 p-2">
                  {isLoggedIn ? (
                    <>
                      <button
                        onClick={() => {
                            setAvatarMenuOpen(false);
                            router.replace("/settings");
                          }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 rounded-lg transition-colors text-text-primary"
                      >
                        <User className="w-4 h-4" />
                        <span>Hồ sơ</span>
                      </button>
                      <button
                        onClick={() => {
                          try {
                            localStorage.removeItem("isLoggedIn");
                            localStorage.removeItem("username");
                          } catch (e) {}
                          setIsLoggedIn(false);
                          setUsername(null);
                          setAvatarMenuOpen(false);
                          router.replace("/login");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 rounded-lg transition-colors text-text-primary"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setAvatarMenuOpen(false);
                        router.replace("/login");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 rounded-lg transition-colors text-text-primary"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng nhập</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 📜 History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">Query History</h2>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {FAKE_HISTORY.map(item => (
                <div key={item.id} className="px-4 py-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-border">
                  <p className="text-sm text-text-primary">{item.query}</p>
                  <p className="text-xs text-text-secondary mt-1">{item.time}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-border">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-text-primary rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
