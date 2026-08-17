-- Stiffler Homestead order fulfillment status
-- Safe to run more than once in the Supabase SQL editor.

alter table public.homestead_orders
  add column if not exists picked_up_at timestamptz;

create index if not exists homestead_orders_pending_pickup_idx
on public.homestead_orders (paid_at desc)
where status = 'paid' and picked_up_at is null;
