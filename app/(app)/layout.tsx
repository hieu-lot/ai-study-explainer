"use client";
// App layout: wraps authenticated pages with Sidebar + TopNav. Manages sidebar state and Cmd+K search.
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import SearchBar from "@/components/SearchBar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/library": "Library",
  "/flashcards": "Flashcards",
  "/settings": "Settings",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const title = pathname.startsWith("/doc/") ? "Study Workspace" : pageTitles[pathname] || "StudyAI";

  const router = useRouter();

  // Protect pages under this layout with simple client-side redirect
  useEffect(() => {
    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        router.push("/login");
      }
    } catch (e) {
      router.push("/login");
    }
  }, [pathname]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-50 w-60 h-full"><Sidebar isOpen onToggle={() => setMobileMenuOpen(false)} /></div>
        </div>
      )}
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav title={title} onMenuClick={() => setMobileMenuOpen(true)} onSearchClick={() => setSearchOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="animate-in">{children}</div>
        </main>
      </div>
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
