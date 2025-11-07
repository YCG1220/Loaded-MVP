"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function ModifierGroupForm() {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({ name: "", description: "", min_select: "0", max_select: "1", is_required: false });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/modifier-groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "",
        },
        body: JSON.stringify({
          name: formState.name,
          description: formState.description,
          min_select: Number(formState.min_select),
          max_select: Number(formState.max_select),
          is_required: formState.is_required,
        }),
      });
      if (!response.ok) throw new Error("Failed to create group");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/modifier-groups"] });
      setFormState({ name: "", description: "", min_select: "0", max_select: "1", is_required: false });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 text-sm">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Name</label>
        <input value={formState.name} onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" required />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Description</label>
        <textarea value={formState.description} onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" rows={2} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Min select</label>
          <input type="number" value={formState.min_select} onChange={(e) => setFormState((s) => ({ ...s, min_select: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Max select</label>
          <input type="number" value={formState.max_select} onChange={(e) => setFormState((s) => ({ ...s, max_select: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">
            <input type="checkbox" checked={formState.is_required} onChange={(e) => setFormState((s) => ({ ...s, is_required: e.target.checked }))} className="rounded border-brand-red/30 text-brand-red focus:ring-brand-red" />
            Required
          </label>
        </div>
      </div>
      <button type="submit" className="btn-primary self-start" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving…" : "Create group"}
      </button>
    </form>
  );
}
