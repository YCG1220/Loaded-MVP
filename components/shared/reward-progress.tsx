import clsx from "clsx";

interface RewardProgressProps {
  currentPoints: number;
  nextTierPoints: number;
  currentTier: string;
  nextTier: string;
}

export function RewardProgress({ currentPoints, nextTierPoints, currentTier, nextTier }: RewardProgressProps) {
  const progress = Math.min(100, Math.round((currentPoints / nextTierPoints) * 100));
  return (
    <div className="rounded-3xl border border-brand-red/10 bg-white/80 p-4 shadow-inner shadow-brand-red/10">
      <div className="flex items-baseline justify-between text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark/60">
        <span>{currentTier} status</span>
        <span>{nextTier} at {nextTierPoints} pts</span>
      </div>
      <div className="mt-3 h-3 rounded-full bg-brand-red/10">
        <div className={clsx("h-full rounded-full bg-brand-red transition-all duration-500", progress > 90 && "animate-pulse")}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm font-semibold text-brand-dark">
        <span>{currentPoints} pts</span>
        <span className="text-brand-red">{nextTierPoints - currentPoints} to {nextTier}</span>
      </div>
    </div>
  );
}
