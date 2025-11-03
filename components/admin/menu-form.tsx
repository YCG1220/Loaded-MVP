"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function MenuForm() {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
    calories: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "",
        },
        body: JSON.stringify({
          name: formState.name,
          description: formState.description,
          price: Number(formState.price),
          image_url: formState.image_url,
          category_id: formState.category_id,
          calories: formState.calories ? Number(formState.calories) : undefined,
        }),
      });
      if (!response.ok) throw new Error("Failed to create menu item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/menu"] });
      setFormState({ name: "", description: "", price: "", image_url: "", category_id: "", calories: "" });
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
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Price ($)</label>
          <input type="number" step="0.01" value={formState.price} onChange={(e) => setFormState((s) => ({ ...s, price: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" required />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Category ID</label>
          <input value={formState.category_id} onChange={(e) => setFormState((s) => ({ ...s, category_id: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" placeholder="uuid" required />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Calories</label>
          <input type="number" value={formState.calories} onChange={(e) => setFormState((s) => ({ ...s, calories: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Image URL</label>
        <input value={formState.image_url} onChange={(e) => setFormState((s) => ({ ...s, image_url: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-red/10 bg-white/80 px-3 py-2" placeholder="https://" />
      </div>
      <button type="submit" className="btn-primary self-start" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving…" : "Create menu item"}
      </button>
    </form>
  );
}
