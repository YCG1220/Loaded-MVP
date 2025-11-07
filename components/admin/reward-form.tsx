"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function RewardForm() {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({ name: "", description: "", points_cost: "100", is_active: true });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "",
        },
        body: JSON.stringify({
          name: formState.name,
          description: formState.description,
          points_cost: Number(formState.points_cost),
          is_active: formState.is_active,
        }),
      });
      if (!response.ok) throw new Error("Failed to create reward");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rewards"] });
      setFormState({ name: "", description: "", points_cost: "100", is_active: true });
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
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Points cost</label>
          <input type="number" value={formState.points_cost} onChange={(e) => setFormState((s) => ({ ...s, points_cost: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" required />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Description</label>
        <textarea value={formState.description} onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" rows={2} />
      </div>
      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">
        <input type="checkbox" checked={formState.is_active} onChange={(e) => setFormState((s) => ({ ...s, is_active: e.target.checked }))} className="rounded border-brand-red/30 text-brand-red focus:ring-brand-red" />
        Active
      </label>
      <button type="submit" className="btn-primary self-start" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving…" : "Create reward"}
      </button>
    </form>
  );
}
