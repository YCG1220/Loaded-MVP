-- Supabase SQL schema for Loaded App MVP
-- Execute via Supabase SQL editor before running the application

create extension if not exists "pgcrypto";

create type if not exists order_status as enum ('pending', 'in_progress', 'ready', 'completed', 'cancelled');

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
create index if not exists idx_backfill_runs_started_at on public.backfill_runs (started_at desc);
create index if not exists idx_stock_backfill_diffs_run on public.stock_backfill_diffs (backfill_run_id);
create index if not exists idx_stock_backfill_diffs_inventory on public.stock_backfill_diffs (inventory_item_id, location);

create or replace function public.run_stock_levels_backfill(
  run_name text,
  p_batch_limit integer default 1000,
  p_apply boolean default false
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_run_id uuid;
  v_batch_limit integer := greatest(coalesce(p_batch_limit, 1000), 1);
  v_batch_count integer;
  v_processed integer := 0;
  v_inserted integer := 0;
  v_updated integer := 0;
  v_total integer := 0;
  v_started_at timestamptz := clock_timestamp();
  v_row record;
  v_location text;
  v_inventory_sku text;
begin
  perform 1 from information_schema.columns
   where table_schema = 'public' and table_name = 'stock_movements' and column_name = 'inventory_item_id';
  if not found then
    raise exception 'Column stock_movements.inventory_item_id is required.';
  end if;

  perform 1 from information_schema.columns
   where table_schema = 'public' and table_name = 'stock_movements' and column_name = 'change_qty';
  if not found then
    raise exception 'Column stock_movements.change_qty is required.';
  end if;

  perform 1 from information_schema.columns
   where table_schema = 'public' and table_name = 'stock_levels' and column_name = 'inventory_item_id';
  if not found then
    raise exception 'Column stock_levels.inventory_item_id is required.';
  end if;

  perform 1 from information_schema.columns
   where table_schema = 'public' and table_name = 'stock_levels' and column_name = 'quantity';
  if not found then
    raise exception 'Column stock_levels.quantity is required.';
  end if;

  insert into public.backfill_runs (run_name, started_at, details)
  values (
    coalesce(run_name, format('stock-backfill-%s', to_char(v_started_at, 'YYYYMMDDHH24MISS'))),
    v_started_at,
    jsonb_build_object('apply', p_apply, 'batch_limit', v_batch_limit)
  )
  returning id into v_run_id;

  create temporary table temp_backfill_source
  on commit drop as
  select
    inventory_item_id,
    coalesce(location, '__default__') as location_key,
    sum(change_qty) as computed_quantity
  from public.stock_movements
  group by inventory_item_id, coalesce(location, '__default__');

  v_total := (select count(*) from temp_backfill_source);

  <<existing_loop>>
  loop
    v_batch_count := 0;
    for v_row in
      select
        sl.id as stock_level_id,
        sl.inventory_item_id,
        coalesce(sl.location, '__default__') as location_key,
        sl.quantity as current_quantity,
        src.computed_quantity
      from public.stock_levels sl
      join temp_backfill_source src
        on src.inventory_item_id = sl.inventory_item_id
       and src.location_key = coalesce(sl.location, '__default__')
      order by sl.inventory_item_id, src.location_key
      limit v_batch_limit
      for update skip locked
    loop
      v_batch_count := v_batch_count + 1;
      v_location := case when v_row.location_key = '__default__' then null else v_row.location_key end;

      insert into public.stock_backfill_diffs (
        backfill_run_id,
        inventory_item_id,
        location,
        previous_quantity,
        new_quantity,
        computed_at
      )
      values (
        v_run_id,
        v_row.inventory_item_id,
        v_location,
        v_row.current_quantity,
        v_row.computed_quantity,
        clock_timestamp()
      );

      if p_apply then
        update public.stock_levels
          set quantity = v_row.computed_quantity,
              last_updated = clock_timestamp()
        where id = v_row.stock_level_id;
        v_updated := v_updated + 1;
      end if;

      delete from temp_backfill_source
      where inventory_item_id = v_row.inventory_item_id
        and location_key = v_row.location_key;
      v_processed := v_processed + 1;
    end loop;

    exit existing_loop when v_batch_count = 0;
  end loop existing_loop;

  for v_row in
    select inventory_item_id, location_key, computed_quantity
    from temp_backfill_source
  loop
    v_location := case when v_row.location_key = '__default__' then null else v_row.location_key end;

    insert into public.stock_backfill_diffs (
      backfill_run_id,
      inventory_item_id,
      location,
      previous_quantity,
      new_quantity,
      computed_at
    )
    values (
      v_run_id,
      v_row.inventory_item_id,
      v_location,
      null,
      v_row.computed_quantity,
      clock_timestamp()
    );

    if p_apply then
      select coalesce(sku, format('ITEM-%s', v_row.inventory_item_id::text))
        into v_inventory_sku
      from public.inventory_items
      where id = v_row.inventory_item_id;

      begin
        insert into public.stock_levels (
          inventory_item_id,
          location,
          quantity,
          min_quantity,
          last_updated,
          inventory_sku
        )
        values (
          v_row.inventory_item_id,
          v_location,
          v_row.computed_quantity,
          0,
          clock_timestamp(),
          coalesce(v_inventory_sku, format('ITEM-%s', v_row.inventory_item_id::text))
        );
        v_inserted := v_inserted + 1;
      exception
        when unique_violation then
          update public.stock_levels
            set quantity = v_row.computed_quantity,
                last_updated = clock_timestamp()
          where inventory_item_id = v_row.inventory_item_id
            and coalesce(location, '__default__') = v_row.location_key;
          v_updated := v_updated + 1;
      end;
    end if;

    v_processed := v_processed + 1;
  end loop;

  update public.backfill_runs
    set completed_at = clock_timestamp(),
        details = coalesce(details, '{}'::jsonb) || jsonb_build_object(
          'apply', p_apply,
          'batch_limit', v_batch_limit,
          'processed_rows', v_processed,
          'inserted_rows', v_inserted,
          'updated_rows', v_updated,
          'total_rows', v_total
        )
  where id = v_run_id;

  return v_run_id;
exception
  when others then
    update public.backfill_runs
      set completed_at = clock_timestamp(),
          details = coalesce(details, '{}'::jsonb) || jsonb_build_object(
            'apply', p_apply,
            'batch_limit', v_batch_limit,
            'error', SQLERRM
          )
    where id = v_run_id;
    raise;
end;
$$;
