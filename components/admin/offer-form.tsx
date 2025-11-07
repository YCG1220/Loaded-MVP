"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function OfferForm() {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({
    code: "",
    name: "",
    description: "",
    discount_type: "amount",
    discount_value: "",
    bonus_points: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "",
        },
        body: JSON.stringify({
          code: formState.code,
          name: formState.name,
          description: formState.description,
          discount_type: formState.discount_type,
          discount_value: formState.discount_value ? Number(formState.discount_value) : undefined,
          bonus_points: formState.bonus_points ? Number(formState.bonus_points) : undefined,
          start_date: formState.start_date || undefined,
          end_date: formState.end_date || undefined,
          is_active: formState.is_active,
        }),
      });
      if (!response.ok) throw new Error("Failed to create offer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/offers"] });
      setFormState({ code: "", name: "", description: "", discount_type: "amount", discount_value: "", bonus_points: "", start_date: "", end_date: "", is_active: true });
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
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Code</label>
          <input value={formState.code} onChange={(e) => setFormState((s) => ({ ...s, code: e.target.value.toUpperCase() }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" maxLength={16} required />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Name</label>
          <input value={formState.name} onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" required />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Description</label>
        <textarea value={formState.description} onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Discount type</label>
          <select value={formState.discount_type} onChange={(e) => setFormState((s) => ({ ...s, discount_type: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2">
            <option value="amount">Amount ($)</option>
            <option value="percent">Percent (%)</option>
            <option value="bonus_points">Bonus points</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Discount value</label>
          <input type="number" value={formState.discount_value} onChange={(e) => setFormState((s) => ({ ...s, discount_value: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Bonus points</label>
          <input type="number" value={formState.bonus_points} onChange={(e) => setFormState((s) => ({ ...s, bonus_points: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">
            <input type="checkbox" checked={formState.is_active} onChange={(e) => setFormState((s) => ({ ...s, is_active: e.target.checked }))} className="rounded border-brand-red/30 text-brand-red focus:ring-brand-red" />
            Active
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Start date</label>
          <input type="datetime-local" value={formState.start_date} onChange={(e) => setFormState((s) => ({ ...s, start_date: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">End date</label>
          <input type="datetime-local" value={formState.end_date} onChange={(e) => setFormState((s) => ({ ...s, end_date: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
      </div>
      <button type="submit" className="btn-primary self-start" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving…" : "Create offer"}
      </button>
    </form>
  );
}
