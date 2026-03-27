import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#6366F1", hover: "#4F46E5", light: "#818CF8", 50: "#EEF2FF" },
        secondary: { DEFAULT: "#14B8A6" },
        surface: "#FFFFFF",
        page: "#F8FAFC",
        "text-primary": "#0F172A",
        "text-secondary": "#64748B",
        border: "#E2E8F0",
      },
      borderRadius: { sm: "8px", md: "12px", lg: "16px", pill: "9999px" },
      fontFamily: { sans: ["var(--font-inter)", "Inter", "sans-serif"] },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
        md: "0 4px 6px -1px rgba(0,0,0,0.1)",
        glass: "0 8px 32px rgba(31,38,135,0.07)",
      },
      transitionDuration: { fast: "120ms", standard: "240ms", slow: "400ms" },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
        fadeIn: { "0%": { opacity: "0", transform: "translateY(4px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: { shimmer: "shimmer 1.5s infinite linear", "fade-in": "fadeIn 240ms ease-out" },
    },
  },
  plugins: [],
};
export default config;
