-- Supabase SQL schema for Loaded App MVP
-- Execute via Supabase SQL editor before running the application

-- Users table (Supabase auth.users provides base fields)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  loyalty_tier text not null default 'fan',
  yearly_points integer not null default 0,
  spendable_points integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create type order_status as enum ('pending', 'in_progress', 'ready', 'completed', 'cancelled');

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
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
  protein numeric(5,2),
  carbs numeric(5,2),
  fat numeric(5,2),
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
  name text not null,
  sku text unique,
  unit text not null,
  grams_per_unit numeric(10,2),
  cost_per_unit numeric(10,2),
  quantity_on_hand numeric(10,2) default 0,
  reorder_threshold numeric(10,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
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

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.modifier_groups enable row level security;
alter table public.modifiers enable row level security;
alter table public.inventory_items enable row level security;
alter table public.menu_item_inventory enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.rewards enable row level security;
alter table public.offers enable row level security;

create policy "Public read menu" on public.menu_items for select using (is_active = true);
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read modifier groups" on public.modifier_groups for select using (true);
create policy "Public read modifiers" on public.modifiers for select using (true);

create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users insert own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Users manage own order items" on public.order_items for all using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

create policy "Service role full access" on public.categories for all using (auth.role() = 'service_role');
create policy "Service role full access" on public.menu_items for all using (auth.role() = 'service_role');
create policy "Service role full access" on public.modifier_groups for all using (auth.role() = 'service_role');
create policy "Service role full access" on public.modifiers for all using (auth.role() = 'service_role');
create policy "Service role full access" on public.inventory_items for all using (auth.role() = 'service_role');
create policy "Service role full access" on public.menu_item_inventory for all using (auth.role() = 'service_role');
create policy "Service role full access" on public.rewards for all using (auth.role() = 'service_role');
create policy "Service role full access" on public.offers for all using (auth.role() = 'service_role');
create policy "Service role full access" on public.orders for all using (auth.role() = 'service_role');
create policy "Service role full access" on public.order_items for all using (auth.role() = 'service_role');

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, loyalty_tier)
  values (new.id, new.raw_user_meta_data ->> 'full_name', 'fan');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
