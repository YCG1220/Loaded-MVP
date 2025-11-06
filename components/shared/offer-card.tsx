"use client";

import { useMemo, useState } from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { OfferSummary } from "../../src/types/loyalty";

interface OfferCardProps {
  offer: OfferSummary;
}

function buildBadge(offer: OfferSummary) {
  if (offer.discountType === "percent" && offer.discountValue) {
    return `${offer.discountValue}% off`;
  }
  if (offer.discountType === "amount" && offer.discountValue) {
    return `Save $${Number(offer.discountValue).toFixed(2)}`;
  }
  if (offer.bonusPoints) {
    return `+${offer.bonusPoints} pts`;
  }
  return undefined;
}

function buildExpiryLabel(offer: OfferSummary) {
  if (offer.endDate) {
    const end = new Date(offer.endDate);
    return `Ends ${end.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  }
  if (offer.startDate) {
    const start = new Date(offer.startDate);
    return `Live since ${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  }
  return "Ongoing";
}

export function OfferCard({ offer }: OfferCardProps) {
  const [isActive, setIsActive] = useState(false);
  const badge = useMemo(() => buildBadge(offer), [offer]);
  const expiryLabel = useMemo(() => buildExpiryLabel(offer), [offer]);

  return (
    <button
      type="button"
      onClick={() => setIsActive((prev) => !prev)}
      className={`group relative flex w-full flex-col gap-4 rounded-[28px] border bg-white/90 px-5 py-5 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-2xl ${
        isActive ? "border-brand-red/40" : "border-brand-red/15"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
              isActive
                ? "border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/40"
                : "border-brand-red/20 bg-brand-red/10 text-brand-red"
            }`}
          >
            {isActive ? <CheckBadgeIcon className="h-6 w-6" /> : <SparklesIcon className="h-6 w-6" />}
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-lg font-semibold text-brand-dark">{offer.name}</h3>
            {offer.description && <p className="text-sm text-brand-dark/70">{offer.description}</p>}
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-brand-dark/40">Code: {offer.code}</p>
          </div>
        </div>
        {badge && (
          <span className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/50">
        <span>Status: {isActive ? "On your account" : offer.isActive ? "Tap to activate" : "Unavailable"}</span>
        <span className="text-brand-red/70">{expiryLabel}</span>
      </div>
      {isActive && (
        <div className="rounded-2xl border border-brand-red/20 bg-brand-red/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
          Applied automatically at checkout.
        </div>
      )}
    </button>
  );
}
