"use client";
// FlashcardCard: 3D flip card (400ms rotateY). Space/Enter to flip. Focus-managed for a11y.
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface FlashcardCardProps { front: string; back: string; className?: string; }

export default function FlashcardCard({ front, back, className }: FlashcardCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
    console.info("flashcard-flip", { wasFlipped: !isFlipped });
  }, [isFlipped]);

  return (
    <div className={cn("perspective w-full max-w-md mx-auto cursor-pointer outline-none focus:ring-2 focus:ring-primary/30 rounded-[16px]", className)}
      onClick={handleFlip} onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleFlip(); } }}
      tabIndex={0} role="button" aria-label={isFlipped ? "Showing answer. Press to show question." : "Showing question. Press to flip."}>
      <div className={cn("relative w-full aspect-[3/2] preserve-3d transition-transform ease-[cubic-bezier(0.4,0,0.2,1)]",
        isFlipped && "[transform:rotateY(180deg)]")} style={{ transitionDuration: "400ms" }}>
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-[16px] border border-border shadow-md hover:shadow-lg transition-shadow duration-[120ms] flex flex-col items-center justify-center p-8 text-center">
          <p className="text-lg font-semibold text-text-primary leading-relaxed">{front}</p>
          <p className="text-xs text-text-secondary mt-6 opacity-60">Click or press Space to flip</p>
        </div>
        {/* Back */}
        <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-gradient-to-br from-primary-50 to-white rounded-[16px] border border-primary/20 shadow-md flex flex-col items-center justify-center p-8 text-center">
          <p className="text-base text-text-primary leading-relaxed">{back}</p>
          <p className="text-xs text-text-secondary mt-6 opacity-60">Click or press Space to flip back</p>
        </div>
      </div>
    </div>
  );
}
