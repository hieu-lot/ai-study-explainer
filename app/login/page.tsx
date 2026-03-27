"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn) router.replace("/library");
    } catch (e) {}
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      try {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username || "User");
      } catch (err) {}
      router.replace("/library");
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      
      {/* Background image */}
      <img
        src="/login-bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay (fix ảnh bị tối/chìm) */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/70" />

      {/* Blur layer */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Glow effect */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full" />

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 animate-fadeUp hover:shadow-indigo-500/30 transition relative">
          
          <div className="text-center mb-6">
            <h1 className="text-white text-2xl font-bold tracking-wide">
              StudyAI
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Đăng nhập để tiếp tục
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên đăng nhập"
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 transition"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold rounded-lg py-2 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/40 transition-all duration-200 disabled:opacity-70"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}