"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface BackfillRun {
  id: string;
  run_name: string | null;
  started_at: string | null;
  completed_at: string | null;
  details: Record<string, unknown> | null;
}

interface BackfillDiff {
  id: string;
  inventory_item_id: string;
  location: string | null;
  previous_quantity: number | null;
  new_quantity: number | null;
  computed_at: string | null;
}

const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { "x-admin-secret": adminSecret },
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export default function AdminBackfillPage() {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const runsQuery = useQuery<BackfillRun[]>({
    queryKey: ["/api/admin/backfill/runs"],
    queryFn: () => fetchJson<BackfillRun[]>("/api/admin/backfill/runs"),
  });

  const diffsQuery = useQuery<BackfillDiff[]>({
    queryKey: ["/api/admin/backfill/runs", selectedRunId, "diffs"],
    queryFn: () => fetchJson<BackfillDiff[]>(`/api/admin/backfill/runs/${selectedRunId}/diffs`),
    enabled: Boolean(selectedRunId),
  });

  const mutation = useMutation({
    mutationFn: async ({ apply }: { apply: boolean }) => {
      const response = await fetch("/api/admin/backfill/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({ apply }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.error ?? "Failed to trigger backfill");
      }
      return response.json() as Promise<{ run_id: string }>;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/backfill/runs"] });
      setSelectedRunId(data.run_id);
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/backfill/runs", data.run_id, "diffs"] });
    },
  });

  const selectedRun = useMemo(
    () => runsQuery.data?.find((run) => run.id === selectedRunId) ?? null,
    [runsQuery.data, selectedRunId],
  );

  const handleRun = async (apply: boolean) => {
    if (apply) {
      const confirmation = window.prompt("Type APPLY to run with updates. Make sure you have a backup.");
      if (confirmation?.toLowerCase() !== "apply") {
        return;
      }
    }
    mutation.mutate({ apply });
  };

  return (
    <section className="space-y-6 rounded-3xl border border-brand-red/10 bg-white/80 p-6 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-dark/50">Inventory integrity</p>
          <h2 className="font-display text-2xl font-semibold text-brand-dark">Stock level backfill</h2>
          <p className="mt-1 max-w-2xl text-sm text-brand-dark/70">
            Dry-run the reconciliation against stock movements, review diffs, then apply once you&apos;ve coordinated with ops.
          </p>
        </div>
        <div className="flex min-w-[200px] flex-col items-stretch gap-2">
          <button
            type="button"
            onClick={() => handleRun(false)}
            disabled={mutation.isPending}
            className="rounded-full border border-brand-red/20 bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Running…" : "Run backfill (dry-run)"}
          </button>
          <button
            type="button"
            onClick={() => handleRun(true)}
            disabled={mutation.isPending}
            className="rounded-full border border-brand-red/20 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-red shadow-sm transition hover:border-brand-red hover:bg-brand-cream/80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Apply adjustments
          </button>
        </div>
      </header>

      {runsQuery.isLoading && <p className="text-sm text-brand-dark/60">Loading recent runs…</p>}
      {runsQuery.error && <p className="text-sm text-red-600">{(runsQuery.error as Error).message}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px),1fr]">
        <div className="space-y-3">
          <h3 className="font-display text-lg font-semibold text-brand-dark">Recent runs</h3>
          <div className="space-y-3">
            {runsQuery.data?.map((run) => {
              const applied = Boolean(run.details && (run.details as Record<string, unknown>)["apply"]);
              const completed = Boolean(run.completed_at);
              return (
                <button
                  key={run.id}
                  onClick={() => setSelectedRunId(run.id)}
                  className={`w-full rounded-3xl border px-4 py-3 text-left transition ${
                    run.id === selectedRunId
                      ? "border-brand-red bg-brand-red/10"
                      : "border-brand-red/10 bg-white/80 hover:border-brand-red/40"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-dark/50">{run.run_name ?? run.id.slice(0, 8)}</p>
                  <p className="mt-1 font-semibold text-brand-dark">
                    {new Date(run.started_at ?? Date.now()).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-brand-dark/60">
                    {completed ? "Completed" : "In progress"}
                    {applied ? " • Applied" : " • Dry-run"}
                  </p>
                </button>
              );
            })}
            {runsQuery.data && runsQuery.data.length === 0 && (
              <p className="rounded-3xl border border-brand-dark/10 bg-brand-cream/60 p-4 text-sm text-brand-dark/70">
                No backfill runs yet. Start with a dry-run to populate diffs.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-brand-dark">Diff preview</h3>
            {selectedRun && (
              <span className="text-xs uppercase tracking-[0.3em] text-brand-dark/50">Run {selectedRun.id.slice(0, 8)}</span>
            )}
          </div>
          {!selectedRunId && (
            <p className="rounded-3xl border border-brand-dark/10 bg-brand-cream/50 p-4 text-sm text-brand-dark/70">
              Select a run to review quantity deltas. Dry-runs capture up to 200 rows for quick QA.
            </p>
          )}
          {selectedRunId && diffsQuery.isLoading && <p className="text-sm text-brand-dark/60">Loading diffs…</p>}
          {selectedRunId && diffsQuery.error && (
            <p className="text-sm text-red-600">{(diffsQuery.error as Error).message}</p>
          )}
          {selectedRunId && diffsQuery.data && diffsQuery.data.length > 0 && (
            <div className="max-h-[420px] overflow-auto rounded-3xl border border-brand-red/10 bg-white/90 shadow-inner">
              <table className="min-w-full divide-y divide-brand-red/10 text-sm text-brand-dark/80">
                <thead className="sticky top-0 bg-brand-cream/80 text-xs uppercase tracking-[0.3em] text-brand-dark/60">
                  <tr>
                    <th className="px-4 py-3 text-left">Inventory item</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-right">Previous</th>
                    <th className="px-4 py-3 text-right">Computed</th>
                    <th className="px-4 py-3 text-right">Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-red/5">
                  {diffsQuery.data.map((diff) => {
                    const delta = (diff.new_quantity ?? 0) - (diff.previous_quantity ?? 0);
                    return (
                      <tr key={diff.id}>
                        <td className="px-4 py-3 font-medium text-brand-dark">{diff.inventory_item_id.slice(0, 8)}</td>
                        <td className="px-4 py-3 text-brand-dark/70">{diff.location ?? "—"}</td>
                        <td className="px-4 py-3 text-right">{diff.previous_quantity ?? 0}</td>
                        <td className="px-4 py-3 text-right">{diff.new_quantity ?? 0}</td>
                        <td
                          className={`px-4 py-3 text-right font-semibold ${
                            delta === 0
                              ? "text-brand-dark/50"
                              : delta > 0
                              ? "text-emerald-600"
                              : "text-brand-red"
                          }`}
                        >
                          {delta.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {selectedRunId && diffsQuery.data && diffsQuery.data.length === 0 && (
            <p className="rounded-3xl border border-brand-dark/10 bg-brand-cream/60 p-4 text-sm text-brand-dark/70">
              No diffs recorded for this run yet. If the job is still running, refresh in a few moments.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
