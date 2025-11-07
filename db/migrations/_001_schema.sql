-- Migration: Base schema for menu, inventory, and order tracking
-- Applies the core tables and policies required by the Loaded MVP
-- Safe to re-run thanks to CREATE IF NOT EXISTS guards.

create extension if not exists "pgcrypto";

create type if not exists order_status as enum (
  'pending',
  'in_progress',
  'ready',
  'completed',
  'cancelled'
);

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  loyalty_tier text not null default 'fan',
  yearly_points integer not null default 0,
  spendable_points integer not null default 0,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null,
  subtitle text,
  image_url text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  is_active boolean default true,
  calories integer,
  protein numeric(6,2),
  carbs numeric(6,2),
  fat numeric(6,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.modifier_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  min_select integer default 0,
  max_select integer default 1,
  is_required boolean default false,
  step integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.modifiers (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.modifier_groups on delete cascade,
  name text not null,
  price_delta numeric(10,2) default 0,
  calories integer,
  grams numeric(6,2),
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.menu_item_modifiers (
  menu_item_id uuid references public.menu_items on delete cascade,
  modifier_group_id uuid references public.modifier_groups on delete cascade,
  primary key (menu_item_id, modifier_group_id)
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  name text not null,
  description text,
  unit_of_measure text,
  cost_cents integer,
  created_at timestamptz default now()
);

create table if not exists public.lots (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid references public.inventory_items on delete cascade,
  lot_code text,
  expiry_date date,
  created_at timestamptz default now()
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid references public.inventory_items on delete cascade,
  product_id uuid,
  change_qty numeric not null,
  movement_type text not null,
  reference_table text,
  reference_id uuid,
  lot_id uuid references public.lots,
  unit_cost_cents integer,
  location text,
  created_at timestamptz default now()
);

create table if not exists public.stock_levels (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references public.inventory_items on delete cascade,
  location text,
  quantity numeric not null default 0,
  min_quantity numeric default 0,
  last_updated timestamptz default now(),
  inventory_sku text not null,
  constraint stock_levels_inventory_location_unique unique (inventory_item_id, location)
);

create table if not exists public.menu_item_inventory (
  menu_item_id uuid references public.menu_items on delete cascade,
  inventory_item_id uuid references public.inventory_items on delete cascade,
  grams_per_item numeric(10,2) not null,
  primary key (menu_item_id, inventory_item_id)
);

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  points_cost integer not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  discount_type text check (discount_type in ('amount', 'percent', 'bonus_points')),
  discount_value numeric(10,2),
  bonus_points integer,
  start_date timestamptz,
  end_date timestamptz,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  store_id text,
  subtotal numeric(10,2) not null,
  discount numeric(10,2) default 0,
  tax numeric(10,2) default 0,
  total numeric(10,2) not null,
  points_earned integer default 0,
  points_redeemed integer default 0,
  status order_status default 'pending',
  fulfillment_method text check (fulfillment_method in ('pickup', 'delivery')),
  placed_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders on delete cascade,
  menu_item_id uuid references public.menu_items,
  name text not null,
  quantity integer not null,
  base_price numeric(10,2) not null,
  modifiers jsonb default '[]'::jsonb,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users,
  action text not null,
  table_name text,
  record_id uuid,
  payload jsonb,
  created_at timestamptz default now()
);

create table if not exists public.sales_orders (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  channel text,
  status text default 'completed',
  total_cents bigint,
  created_at timestamptz default now()
);

create table if not exists public.sales_lines (
  id uuid primary key default gen_random_uuid(),
  sales_order_id uuid references public.sales_orders on delete cascade,
  product_id uuid,
  inventory_item_id uuid,
  qty numeric not null,
  unit_price_cents integer,
  discount_cents integer default 0,
  cost_at_sale_cents integer,
  created_at timestamptz default now(),
  backfill_processed boolean default false,
  backfill_run_id uuid
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, loyalty_tier, is_admin)
  values (new.id, new.raw_user_meta_data ->> 'full_name', 'fan', false)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create index if not exists idx_menu_items_category on public.menu_items (category_id);
create index if not exists idx_modifiers_group on public.modifiers (group_id);
create index if not exists idx_stock_movements_inventory_location on public.stock_movements (inventory_item_id, location);
create index if not exists idx_stock_levels_inventory_location on public.stock_levels (inventory_item_id, location);
create index if not exists idx_orders_user on public.orders (user_id);
create index if not exists idx_sales_lines_sales_order on public.sales_lines (sales_order_id);
