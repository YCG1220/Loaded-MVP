"use client";

import { MenuItem } from "../../src/types/menu";
import { useMemo } from "react";

interface CartItem {
  item: MenuItem;
  modifiers: Record<string, string[]>;
}

interface CartSummaryProps {
  cart: CartItem[];
}

export function CartSummary({ cart }: CartSummaryProps) {
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, cartItem) => sum + cartItem.item.price, 0);
    const tax = subtotal * 0.0825;
    const total = subtotal + tax;
    const points = Math.floor(subtotal * 10);
    return { subtotal, tax, total, points };
  }, [cart]);

  return (
    <aside className="card sticky top-4 space-y-4">
      <div className="section-title">
        <span className="h-2 w-2 rounded-full bg-brand-red" />
        Your Order
      </div>
      <ul className="space-y-3">
        {cart.map((cartItem, index) => (
          <li key={`${cartItem.item.id}-${index}`} className="rounded-2xl border border-brand-red/10 bg-white/70 p-4">
            <div className="flex items-center justify-between text-sm font-semibold text-brand-dark">
              <span>{cartItem.item.name}</span>
              <span>${cartItem.item.price.toFixed(2)}</span>
            </div>
            {Object.values(cartItem.modifiers).flat().length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-brand-dark/70">
                {Object.entries(cartItem.modifiers).map(([groupId, selections]) => (
                  <li key={groupId}>{selections.join(", ")}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="space-y-2 text-sm text-brand-dark/80">
        <div className="flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>${totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (8.25%)</span>
          <span>${totals.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-brand-red">
          <span>Estimated Loaded Points</span>
          <span>{totals.points}</span>
        </div>
        <div className="flex justify-between text-base font-semibold text-brand-dark">
          <span>Total</span>
          <span>${totals.total.toFixed(2)}</span>
        </div>
      </div>
      <button type="button" className="btn-primary w-full justify-between">
        <span>Proceed to checkout</span>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs">${totals.total.toFixed(2)}</span>
      </button>
    </aside>
  );
}
