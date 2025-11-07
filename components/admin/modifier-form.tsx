"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function ModifierForm() {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({ group_id: "", name: "", price_delta: "0", calories: "", grams: "", is_default: false });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/modifiers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "",
        },
        body: JSON.stringify({
          group_id: formState.group_id,
          name: formState.name,
          price_delta: Number(formState.price_delta),
          calories: formState.calories ? Number(formState.calories) : undefined,
          grams: formState.grams ? Number(formState.grams) : undefined,
          is_default: formState.is_default,
        }),
      });
      if (!response.ok) throw new Error("Failed to create modifier");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/modifiers"] });
      setFormState({ group_id: "", name: "", price_delta: "0", calories: "", grams: "", is_default: false });
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
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Group ID</label>
          <input value={formState.group_id} onChange={(e) => setFormState((s) => ({ ...s, group_id: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" required />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Name</label>
          <input value={formState.name} onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" required />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Price delta</label>
          <input type="number" step="0.01" value={formState.price_delta} onChange={(e) => setFormState((s) => ({ ...s, price_delta: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Calories</label>
          <input type="number" value={formState.calories} onChange={(e) => setFormState((s) => ({ ...s, calories: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Grams</label>
          <input type="number" value={formState.grams} onChange={(e) => setFormState((s) => ({ ...s, grams: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">
        <input type="checkbox" checked={formState.is_default} onChange={(e) => setFormState((s) => ({ ...s, is_default: e.target.checked }))} className="rounded border-brand-red/30 text-brand-red focus:ring-brand-red" />
        Default option
      </label>
      <button type="submit" className="btn-primary self-start" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving…" : "Create modifier"}
      </button>
    </form>
  );
}
