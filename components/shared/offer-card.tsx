"use client";

import { useState } from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface OfferCardProps {
  offer: {
    id: string;
    title: string;
    description: string;
    badge?: string;
    expiresAt?: string;
  };
}

export function OfferCard({ offer }: OfferCardProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setIsActive((prev) => !prev)}
      className={`group relative flex w-full flex-col gap-4 rounded-[28px] border bg-white/85 px-5 py-5 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-2xl ${
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
            <h3 className="font-display text-lg font-semibold text-brand-dark">{offer.title}</h3>
            <p className="text-sm text-brand-dark/70">{offer.description}</p>
          </div>
        </div>
        {offer.badge && (
          <span className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
            {offer.badge}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/50">
        <span>Status: {isActive ? "On your account" : "Tap to add"}</span>
        {offer.expiresAt && <span className="text-brand-red/70">{offer.expiresAt}</span>}
      </div>
      {isActive && (
        <div className="rounded-2xl border border-brand-red/20 bg-brand-red/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
          Applied to next checkout automatically.
        </div>
      )}
    </button>
  );
}
