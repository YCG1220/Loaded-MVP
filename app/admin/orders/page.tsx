"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";

interface OrderRow {
  id: string;
  store_id: string | null;
  subtotal: number;
  discount: number | null;
  tax: number | null;
  total: number;
  status: "pending" | "in_progress" | "ready" | "completed" | "cancelled";
  fulfillment_method: string | null;
  placed_at: string | null;
  order_items: Array<{
    id: string;
    name: string | null;
    quantity: number;
    modifiers: Record<string, string[]> | null;
  }>;
}

const statusPills: Record<OrderRow["status"], string> = {
  pending: "bg-brand-red/10 text-brand-red",
  in_progress: "bg-brand-yellow/20 text-brand-dark",
  ready: "bg-brand-red text-white",
  completed: "bg-emerald-500/10 text-emerald-600",
  cancelled: "bg-brand-dark/10 text-brand-dark/60",
};

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<OrderRow[]>({
    queryKey: ["/api/admin/orders"],
    queryFn: async () => {
      const response = await fetch("/api/admin/orders", { headers: { "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "" } });
      if (!response.ok) throw new Error("Failed to load orders");
      return response.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderRow["status"] }) => {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "",
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update order");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] }),
  });

  return (
    <section className="space-y-4 rounded-3xl border border-brand-red/10 bg-white/80 p-6 shadow-sm">
      <header className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-brand-dark">Live orders</h2>
          <p className="text-sm text-brand-dark/70">Monitor status changes and ensure queue discipline.</p>
        </div>
      </header>
      {isLoading && <p className="text-sm text-brand-dark/60">Loading orders…</p>}
      {error && <p className="text-sm text-red-600">{(error as Error).message}</p>}
      <div className="space-y-4">
        {data?.map((order) => (
          <article key={order.id} className="rounded-3xl border border-brand-red/10 bg-white/90 p-5 shadow">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-brand-dark/50">Order</p>
                <h3 className="font-display text-xl font-semibold text-brand-dark">{order.id.slice(0, 8)}</h3>
                <p className="text-xs text-brand-dark/50">{order.store_id ?? "Unknown store"}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]", statusPills[order.status])}>
                  {order.status.replace("_", " ")}
                </span>
                <select
                  value={order.status}
                  onChange={(event) => mutation.mutate({ id: order.id, status: event.target.value as OrderRow["status"] })}
                  className="rounded-full border border-brand-red/20 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]"
                >
                  {Object.keys(statusPills).map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-right text-sm font-semibold text-brand-dark">
                <p>Total ${order.total.toFixed(2)}</p>
                <p className="text-xs text-brand-dark/50">Subtotal ${order.subtotal.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-brand-dark/80">
              {order.order_items?.map((item) => (
                <div key={item.id} className="rounded-2xl border border-brand-red/10 bg-brand-cream/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-brand-dark">{item.name ?? "Menu item"}</span>
                    <span className="text-xs uppercase tracking-[0.3em] text-brand-dark/60">×{item.quantity}</span>
                  </div>
                  {item.modifiers && Object.values(item.modifiers).flat().length > 0 && (
                    <p className="mt-2 text-xs uppercase tracking-[0.3em] text-brand-dark/50">{Object.values(item.modifiers).flat().join(", ")}</p>
                  )}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
