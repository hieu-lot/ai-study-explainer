import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "StudyAI — AI Study Explainer & Research Organizer",
  description: "Transform complex documents into digestible explanations, flashcards, and organized research notes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-screen overflow-hidden font-sans antialiased bg-page text-text-primary">
        {children}
      </body>
    </html>
  );
}