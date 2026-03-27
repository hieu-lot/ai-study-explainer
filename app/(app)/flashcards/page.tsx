"use client";
// Flashcard Hub: Deck selector, AI flashcard generation, study mode, progress tracking.
import { useState } from "react";
import { Plus, RotateCcw, Sparkles } from "lucide-react";
import FlashcardCard from "@/components/FlashcardCard";
import AIActions from "@/components/AIActions";
import { mockDecks, mockFlashcards } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function FlashcardsPage() {
  const [selectedDeck, setSelectedDeck] = useState(mockDecks[0].id);
  const cards = mockFlashcards.filter((c) => c.deckId === selectedDeck);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [reviewed, setReviewed] = useState(0);
  const [genText, setGenText] = useState("");
  const [showGenForm, setShowGenForm] = useState(false);

  const card = cards[currentIdx];
  const deck = mockDecks.find((d) => d.id === selectedDeck)!;

  const handleResponse = (quality: string) => {
    console.info("flashcard-response", { cardId: card?.id, quality });
    setReviewed((r) => r + 1);
    setCurrentIdx((i) => (i + 1) % cards.length);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-10">
      {/* AI Flashcard Generator */}
      <section className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-[16px] p-6 border border-primary/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Generate Flashcards with AI
          </h2>
          <button
            onClick={() => setShowGenForm(!showGenForm)}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {showGenForm ? "Hide" : "Show"}
          </button>
        </div>
        
        {showGenForm && (
          <div className="space-y-3">
            <textarea
              value={genText}
              onChange={(e) => setGenText(e.target.value)}
              placeholder="Paste study material to auto-generate flashcards..."
              className="w-full h-20 px-4 py-2 bg-white border border-border rounded-[12px] text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow resize-none custom-scrollbar"
            />
            <div className="text-xs text-text-secondary">
              💡 Tip: Paste content and we'll generate Q&A flashcards automatically using AI
            </div>
            {genText && (
              <AIActions
                selectedText={genText}
                bilingual={false}
                onResult={(result) => {
                  console.log("Generated flashcards:", result);
                  setGenText("");
                  setShowGenForm(false);
                }}
              />
            )}
          </div>
        )}
      </section>

      {/* Deck Selector */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Decks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockDecks.map((d) => (
            <button key={d.id} onClick={() => { setSelectedDeck(d.id); setCurrentIdx(0); setReviewed(0); }}
              className={cn("p-5 rounded-[16px] border text-left transition-all duration-[120ms] hover:-translate-y-0.5",
                selectedDeck === d.id ? "border-primary bg-primary-50 shadow-sm" : "border-border bg-white hover:shadow-md")}>
              <p className="font-semibold text-sm">{d.name}</p>
              <p className="text-xs text-text-secondary mt-1">{d.cardCount} cards</p>
              <div className="mt-3 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${d.mastery}%` }} />
              </div>
              <p className="text-xs text-text-secondary mt-1">{d.mastery}% mastery</p>
            </button>
          ))}
          <button className="p-5 rounded-[16px] border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-text-secondary hover:text-primary transition-colors duration-[120ms]">
            <Plus className="w-6 h-6" /><span className="text-sm font-medium">New Deck</span>
          </button>
        </div>
      </section>

      {/* Study Mode */}
      {card && (
        <section className="flex flex-col items-center gap-8">
          <h2 className="text-lg font-semibold">Studying: {deck.name}</h2>
          <FlashcardCard front={card.front} back={card.back} />
          {/* Response Buttons */}
          <div className="flex items-center gap-3">
            <button onClick={() => handleResponse("again")}
              className="px-5 py-2.5 rounded-[12px] border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors duration-[120ms]">✗ Again</button>
            <button onClick={() => handleResponse("hard")}
              className="px-5 py-2.5 rounded-[12px] border border-yellow-200 text-yellow-700 text-sm font-medium hover:bg-yellow-50 transition-colors duration-[120ms]">~ Hard</button>
            <button onClick={() => handleResponse("good")}
              className="px-5 py-2.5 rounded-[12px] border border-green-200 text-green-600 text-sm font-medium hover:bg-green-50 transition-colors duration-[120ms]">✓ Good</button>
          </div>
          {/* Progress */}
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-[240ms]" style={{ width: `${(reviewed / cards.length) * 100}%` }} />
            </div>
            <span className="tabular-nums">{reviewed}/{cards.length} reviewed</span>
            <button onClick={() => { setCurrentIdx(0); setReviewed(0); }} className="p-1.5 hover:bg-slate-100 rounded-[8px]" aria-label="Reset">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
