"use client";

import { MapPinIcon, ClockIcon, BellAlertIcon, MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { RewardProgress } from "../shared/reward-progress";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-white/70 backdrop-blur">
      <div className="flex flex-col gap-4 px-6 py-4 xl:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/70">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-red/10 px-3 py-1 text-brand-red">
              <BellAlertIcon className="h-4 w-4" />
              New offers unlocked
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPinIcon className="h-4 w-4" /> Loaded - Williamsburg
            </span>
            <span className="inline-flex items-center gap-2">
              <ClockIcon className="h-4 w-4" /> Open until 2:00 AM
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">
            <button className="rounded-full border border-brand-red/20 bg-white px-4 py-2 text-brand-dark transition hover:border-brand-red">
              Switch store
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2 text-white">
              <UserCircleIcon className="h-4 w-4" /> My account
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-dark/30" />
            <input
              type="search"
              placeholder="Search menu, combos, or rewards"
              className="w-full rounded-full border border-brand-red/10 bg-white/80 py-3 pl-12 pr-6 text-sm text-brand-dark placeholder:text-brand-dark/40 shadow-inner"
            />
          </div>
          <div className="w-full max-w-sm">
            <RewardProgress currentPoints={720} nextTierPoints={1000} currentTier="Fan" nextTier="Friend" />
          </div>
        </div>
      </div>
    </header>
  );
}
