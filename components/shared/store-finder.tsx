"use client";

import { MapPinIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const stores = [
  {
    id: "brooklyn",
    name: "Loaded - Williamsburg",
    address: "123 Bedford Ave, Brooklyn",
    distance: "0.6 mi",
    hours: "Open until 2:00 AM",
  },
  {
    id: "queens",
    name: "Loaded - Astoria",
    address: "45-02 Broadway, Queens",
    distance: "2.1 mi",
    hours: "Open until 1:00 AM",
  },
];

export function StoreFinder() {
  const [selectedStore, setSelectedStore] = useState(stores[0]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {stores.map((store) => (
          <button
            key={store.id}
            type="button"
            onClick={() => setSelectedStore(store)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
              selectedStore.id === store.id ? "border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/30" : "border-brand-red/20 bg-white text-brand-dark/70 hover:border-brand-red"
            }`}
          >
            {store.distance}
          </button>
        ))}
      </div>
      <div className="rounded-[28px] border border-brand-red/15 bg-white/85 p-6 shadow-lg shadow-brand-red/10">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">
          <MapPinIcon className="h-5 w-5" />
          Preferred store
        </div>
        <div className="mt-4 space-y-1">
          <h4 className="font-display text-2xl font-semibold text-brand-dark">{selectedStore.name}</h4>
          <p className="text-sm text-brand-dark/70">{selectedStore.address}</p>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">{selectedStore.hours}</p>
        </div>
      </div>
    </div>
  );
}
