"use client";

import { useState, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "@heroicons/react/24/outline";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T extends { id?: string }> {
  title: string;
  description: string;
  endpoint: string;
  columns: Column<T>[];
  form: ReactNode;
}

export function DataTable<T extends { id?: string }>({ title, description, endpoint, columns, form }: DataTableProps<T>) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const response = await fetch(endpoint, { headers: { "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "" } });
      if (!response.ok) throw new Error("Failed to fetch data");
      return (await response.json()) as T[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
        headers: { "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "" },
      });
      if (!response.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [endpoint] }),
  });

  return (
    <section className="space-y-4 rounded-3xl border border-brand-red/10 bg-white/80 p-6 shadow-sm">
      <header className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-brand-dark">{title}</h2>
          <p className="text-sm text-brand-dark/70">{description}</p>
        </div>
        <button onClick={() => setIsOpen((prev) => !prev)} className="btn-primary flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          {isOpen ? "Close" : "New"}
        </button>
      </header>
      {isOpen && <div className="rounded-2xl border border-brand-red/10 bg-brand-cream/50 p-4">{form}</div>}
      {isLoading && <p className="text-sm text-brand-dark/60">Loading…</p>}
      {error && <p className="text-sm text-red-600">{(error as Error).message}</p>}
      <div className="overflow-hidden rounded-2xl border border-brand-red/10">
        <table className="min-w-full divide-y divide-brand-red/10 text-left text-sm text-brand-dark">
          <thead className="bg-brand-cream/60 text-xs uppercase tracking-[0.3em] text-brand-dark/60">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-4 py-3">
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-red/10 bg-white/80">
            {data?.map((item) => (
              <tr key={item.id as string}>
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-3 align-top">
                    {column.render ? column.render(item) : String(item[column.key] ?? "—")}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <button
                    className="rounded-full border border-brand-red/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red transition hover:border-brand-red"
                    onClick={() => item.id && deleteMutation.mutate(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
