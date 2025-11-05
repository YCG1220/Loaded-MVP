"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function InventoryForm() {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({
    name: "",
    sku: "",
    unit: "grams",
    grams_per_unit: "",
    cost_per_unit: "",
    quantity_on_hand: "",
    reorder_threshold: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "",
        },
        body: JSON.stringify({
          name: formState.name,
          sku: formState.sku || undefined,
          unit: formState.unit,
          grams_per_unit: formState.grams_per_unit ? Number(formState.grams_per_unit) : undefined,
          cost_per_unit: formState.cost_per_unit ? Number(formState.cost_per_unit) : undefined,
          quantity_on_hand: formState.quantity_on_hand ? Number(formState.quantity_on_hand) : undefined,
          reorder_threshold: formState.reorder_threshold ? Number(formState.reorder_threshold) : undefined,
        }),
      });
      if (!response.ok) throw new Error("Failed to create inventory item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inventory"] });
      setFormState({ name: "", sku: "", unit: "grams", grams_per_unit: "", cost_per_unit: "", quantity_on_hand: "", reorder_threshold: "" });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Name</label>
          <input value={formState.name} onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" required />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">SKU</label>
          <input value={formState.sku} onChange={(e) => setFormState((s) => ({ ...s, sku: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Unit</label>
          <input value={formState.unit} onChange={(e) => setFormState((s) => ({ ...s, unit: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Grams per unit</label>
          <input type="number" value={formState.grams_per_unit} onChange={(e) => setFormState((s) => ({ ...s, grams_per_unit: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Cost per unit ($)</label>
          <input type="number" step="0.01" value={formState.cost_per_unit} onChange={(e) => setFormState((s) => ({ ...s, cost_per_unit: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Quantity on hand</label>
          <input type="number" value={formState.quantity_on_hand} onChange={(e) => setFormState((s) => ({ ...s, quantity_on_hand: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Reorder threshold</label>
          <input type="number" value={formState.reorder_threshold} onChange={(e) => setFormState((s) => ({ ...s, reorder_threshold: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
      </div>
      <button type="submit" className="btn-primary self-start" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving…" : "Create inventory item"}
      </button>
    </form>
  );
}
