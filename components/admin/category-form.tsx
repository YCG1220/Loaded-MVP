"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function CategoryForm() {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({ name: "", description: "", sort_order: "" });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "",
        },
        body: JSON.stringify({
          name: formState.name,
          description: formState.description,
          sort_order: formState.sort_order ? Number(formState.sort_order) : undefined,
        }),
      });
      if (!response.ok) throw new Error("Failed to create category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      setFormState({ name: "", description: "", sort_order: "" });
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
      <div>
        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Sort order</label>
        <input type="number" value={formState.sort_order} onChange={(e) => setFormState((s) => ({ ...s, sort_order: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
      </div>
      <button type="submit" className="btn-primary self-start" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving…" : "Create category"}
      </button>
    </form>
  );
}
