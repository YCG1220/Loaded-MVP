"use client";

import { useMemo } from "react";
import { MenuItem } from "../../src/types/menu";

interface CartItem {
  item: MenuItem;
  modifiers: Record<string, string[]>;
}

interface CartSummaryProps {
  cart: CartItem[];
  lastAddedItem?: MenuItem | null;
}

export function CartSummary({ cart, lastAddedItem }: CartSummaryProps) {
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, cartItem) => {
      const modifierTotal = Object.entries(cartItem.modifiers).reduce((modifierSum, [groupId, optionIds]) => {
        const group = cartItem.item.modifierGroups?.find((modifierGroup) => modifierGroup.id === groupId);
        if (!group) return modifierSum;
        const optionSum = optionIds.reduce((optSum, optionId) => {
          const option = group.options.find((candidate) => candidate.id === optionId);
          return optSum + (option?.priceDelta ?? 0);
        }, 0);
        return modifierSum + optionSum;
      }, 0);
      return sum + cartItem.item.price + modifierTotal;
    }, 0);
    const tax = subtotal * 0.0825;
    const total = subtotal + tax;
    const points = Math.floor(subtotal * 12.5);
    return { subtotal, tax, total, points };
  }, [cart]);

  const hasItems = cart.length > 0;

  return (
    <aside className="rounded-[32px] border border-brand-red/20 bg-white/90 p-8 shadow-2xl shadow-brand-red/10 backdrop-blur xl:sticky xl:top-8">
      {lastAddedItem && (
        <div className="mb-6 rounded-3xl border border-emerald-400/40 bg-emerald-500/10 p-5 text-sm text-emerald-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Added to bag</p>
              <p className="font-display text-lg font-semibold">{lastAddedItem.name}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full border border-emerald-500/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700"
              >
                Main menu
              </button>
              <button
                type="button"
                className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-emerald-500/40"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Bag</p>
          <h2 className="font-display text-3xl font-semibold text-brand-dark">{hasItems ? "Almost freak time" : "Bag is feeling light"}</h2>
          <p className="text-sm text-brand-dark/60">
            {hasItems ? "Review your build then head to checkout." : "Add a combo, shake, or fry topper to start your order."}
          </p>
        </div>
        <span className="rounded-full bg-brand-red/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
          {cart.length} item{cart.length === 1 ? "" : "s"}
        </span>
      </div>

      <ul className="mt-6 space-y-4">
        {cart.map((cartItem, index) => (
          <li key={`${cartItem.item.id}-${index}`} className="space-y-2 rounded-2xl border border-brand-red/10 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between text-sm font-semibold text-brand-dark">
              <span>{cartItem.item.name}</span>
              <span>${(cartItem.item.price + Object.entries(cartItem.modifiers).reduce((modifierSum, [groupId, optionIds]) => {
                const group = cartItem.item.modifierGroups?.find((modifierGroup) => modifierGroup.id === groupId);
                if (!group) return modifierSum;
                const optionSum = optionIds.reduce((optSum, optionId) => {
                  const option = group.options.find((candidate) => candidate.id === optionId);
                  return optSum + (option?.priceDelta ?? 0);
                }, 0);
                return modifierSum + optionSum;
              }, 0)).toFixed(2)}</span>
            </div>
            {Object.values(cartItem.modifiers).flat().length > 0 && (
              <ul className="text-xs text-brand-dark/60">
                {Object.entries(cartItem.modifiers).map(([groupId, selections]) => {
                  const group = cartItem.item.modifierGroups?.find((modifierGroup) => modifierGroup.id === groupId);
                  const label = group?.name ?? "Custom";
                  return (
                    <li key={groupId} className="flex items-start gap-2">
                      <span className="font-semibold uppercase tracking-[0.2em] text-brand-dark/40">{label}:</span>
                      <span>{selections.join(", ")}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        ))}
        {!hasItems && (
          <li className="rounded-2xl border border-dashed border-brand-red/30 bg-white/70 px-5 py-6 text-sm text-brand-dark/60">
            Build your first combo to see it here.
          </li>
        )}
      </ul>

      <div className="mt-6 space-y-3 rounded-2xl bg-brand-dark px-6 py-5 text-sm text-white shadow-lg shadow-brand-dark/30">
        <div className="flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>${totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-white/70">
          <span>Tax (8.25%)</span>
          <span>${totals.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-brand-yellow">
          <span>Loaded points</span>
          <span>{totals.points}</span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>${totals.total.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="button"
        className="mt-6 inline-flex w-full items-center justify-between rounded-full bg-brand-red px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-xl shadow-brand-red/40 transition hover:translate-y-[-2px]"
      >
        <span>{hasItems ? "Continue to checkout" : "Browse menu"}</span>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs">${totals.total.toFixed(2)}</span>
      </button>
    </aside>
  );
}
