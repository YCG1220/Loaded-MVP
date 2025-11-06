-- Migration: Backfill metadata tables
-- Adds tables to track stock level reconciliation runs and their computed diffs.

create table if not exists public.backfill_runs (
  id uuid primary key default gen_random_uuid(),
  run_name text,
  started_at timestamptz default now(),
  completed_at timestamptz,
  details jsonb
);

create table if not exists public.stock_backfill_diffs (
  id uuid primary key default gen_random_uuid(),
  backfill_run_id uuid not null references public.backfill_runs on delete cascade,
  inventory_item_id uuid not null references public.inventory_items on delete cascade,
  location text,
  previous_quantity numeric,
  new_quantity numeric,
  computed_at timestamptz default now()
);

create index if not exists idx_backfill_runs_started_at on public.backfill_runs (started_at desc);
create index if not exists idx_stock_backfill_diffs_run on public.stock_backfill_diffs (backfill_run_id);
create index if not exists idx_stock_backfill_diffs_inventory on public.stock_backfill_diffs (inventory_item_id, location);
