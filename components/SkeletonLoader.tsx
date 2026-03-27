// SkeletonLoader: Configurable shimmer loading placeholders (text lines, card grid, document page).
import { cn } from "@/lib/utils";

interface SkeletonLoaderProps { variant?: "text" | "card" | "document"; count?: number; className?: string; }

export default function SkeletonLoader({ variant = "text", count = 4, className }: SkeletonLoaderProps) {
  if (variant === "card") {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="rounded-[16px] border border-border p-5 space-y-3">
            <div className="skeleton h-28 rounded-[12px]" /><div className="skeleton h-4 rounded w-3/4" /><div className="skeleton h-3 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }
  if (variant === "document") {
    return (
      <div className={cn("space-y-4 p-8", className)}>
        <div className="skeleton h-8 rounded w-2/3 mb-6" />
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-4 rounded w-full" /><div className="skeleton h-4 rounded w-5/6" /><div className="skeleton h-4 rounded w-4/5" /><div className="h-4" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }, (_, i) => <div key={i} className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />)}
    </div>
  );
}
