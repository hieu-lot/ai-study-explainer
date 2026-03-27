"use client";
// Settings: Bilingual toggle, dark mode, API status
import { useState } from "react";
import { Moon, Zap, Globe } from "lucide-react";

export default function SettingsPage() {
  const [bilingual, setBilingual] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [apiMode, setApiMode] = useState<"live" | "mock">("live");

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">Settings</h1>
        <p className="text-sm text-text-secondary">Customize your StudyAI experience</p>
      </div>

      {/* Settings Cards */}
      <div className="space-y-4">
        {/* Bilingual Toggle */}
        <div className="bg-white border border-border rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Bilingual Mode</p>
              <p className="text-xs text-text-secondary">English & Vietnamese responses</p>
            </div>
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={bilingual}
              onChange={(e) => setBilingual(e.target.checked)}
              className="w-5 h-5 cursor-pointer accent-primary"
            />
          </label>
        </div>

        {/* Dark Mode Toggle (Fake) */}
        <div className="bg-white border border-border rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-shadow opacity-60 cursor-not-allowed">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Moon className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Dark Mode</p>
              <p className="text-xs text-text-secondary">Coming soon</p>
            </div>
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="w-5 h-5 cursor-not-allowed accent-primary"
              disabled
            />
          </label>
        </div>

        {/* API Status */}
        <div className="bg-white border border-border rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">API Mode</p>
              <p className="text-xs text-text-secondary">
                {apiMode === "live" ? "Connected to OpenAI" : "Using mock responses"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                apiMode === "live"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {apiMode === "live" ? "Live" : "Mock"}
            </span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <p className="text-sm text-blue-900">
          💡 <strong>Tip:</strong> Settings are stored locally in your browser. Reset to defaults by clearing your browser cache.
        </p>
      </div>

      {/* About Section */}
      <div className="bg-slate-50 border border-border rounded-xl p-5 text-center">
        <p className="text-xs text-text-secondary">
          StudyAI v1.0 • Built with Next.js & OpenAI
        </p>
      </div>
    </div>
  );
}
