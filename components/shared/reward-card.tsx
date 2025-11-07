"use client";

import { useState } from "react";
import { GiftIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { RewardSummary } from "../../src/types/loyalty";

interface RewardCardProps {
  reward: RewardSummary;
}

const pointsFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

export function RewardCard({ reward }: RewardCardProps) {
  const [selected, setSelected] = useState(false);
  const pointsLabel = `${pointsFormatter.format(reward.pointsCost)} pts`;

  return (
    <button
      type="button"
      onClick={() => setSelected((prev) => !prev)}
      className={`group flex w-full flex-col gap-4 rounded-[28px] border px-5 py-5 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-2xl ${
        selected ? "border-brand-red/40 bg-brand-red/5" : "border-brand-red/15 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
              selected
                ? "border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/40"
                : "border-brand-red/20 bg-brand-red/10 text-brand-red"
            }`}
          >
            {selected ? <CheckBadgeIcon className="h-6 w-6" /> : <GiftIcon className="h-6 w-6" />}
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-lg font-semibold text-brand-dark">{reward.name}</h3>
            {reward.description && <p className="text-sm text-brand-dark/70">{reward.description}</p>}
          </div>
        </div>
        <span className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
          {pointsLabel}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/50">
        <span>Status: {reward.isActive ? "Ready to redeem" : "Unavailable"}</span>
        {reward.updatedAt && (
          <span className="text-brand-red/70">
            Updated {new Date(reward.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
        )}
      </div>
      {selected && (
        <div className="rounded-2xl border border-brand-red/20 bg-brand-red/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
          Redemption added to checkout bag.
        </div>
      )}
    </button>
  );
}
