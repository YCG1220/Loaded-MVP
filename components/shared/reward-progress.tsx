import clsx from "clsx";

interface RewardProgressProps {
  currentPoints: number;
  nextTierPoints: number;
  currentTier: string;
  nextTier: string;
  className?: string;
}

export function RewardProgress({ currentPoints, nextTierPoints, currentTier, nextTier, className }: RewardProgressProps) {
  const progress = Math.min(100, Math.round((currentPoints / nextTierPoints) * 100));

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-red via-brand-red to-brand-yellow/80 p-5 text-white shadow-lg",
        className
      )}
    >
      <div className="flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
        <span>{currentTier} level</span>
        <span>{nextTier} at {nextTierPoints} pts</span>
      </div>
      <div className="mt-3 h-3 rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white/90 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm font-semibold">
        <span>{currentPoints} pts</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em]">
          {nextTierPoints - currentPoints} to {nextTier}
        </span>
      </div>
    </div>
  );
}
