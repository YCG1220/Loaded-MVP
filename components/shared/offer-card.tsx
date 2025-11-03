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
      className={`relative flex w-full flex-col gap-3 rounded-3xl border border-brand-red/${isActive ? "40" : "10"} bg-white/80 p-5 text-left shadow-lg shadow-brand-red/10 transition hover:-translate-y-1 hover:shadow-2xl`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isActive ? "bg-brand-red text-white" : "bg-brand-red/10 text-brand-red"}`}>
            {isActive ? <CheckBadgeIcon className="h-6 w-6" /> : <SparklesIcon className="h-6 w-6" />}
          </div>
          <div>
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
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark/60">
        <span>Status: {isActive ? "On your account" : "Tap to add"}</span>
        {offer.expiresAt && <span>{offer.expiresAt}</span>}
      </div>
    </button>
  );
}
