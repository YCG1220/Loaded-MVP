-- Migration: Stock level backfill routine
-- Creates a controlled function to reconcile stock_levels from stock_movements with optional apply mode.

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
  -- Validate required columns exist
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
