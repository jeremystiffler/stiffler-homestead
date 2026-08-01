-- Allow customers to order half shares such as 0.5 lamb.
-- Run this once in Supabase SQL editor for the production project.

alter table public.homestead_products
alter column available_quantity type numeric(10,2) using available_quantity::numeric;

alter table public.homestead_orders
alter column quantity type numeric(10,2) using quantity::numeric;

drop function if exists public.decrement_homestead_product_inventory(uuid, integer);

create or replace function public.decrement_homestead_product_inventory(product_id_input uuid, quantity_input numeric)
returns void as $$
declare
  remaining numeric;
begin
  if exists (
    select 1
    from public.homestead_products
    where id = product_id_input
      and infinite_quantity = true
      and status in ('available', 'preorder')
  ) then
    return;
  end if;

  update public.homestead_products
  set available_quantity = available_quantity - quantity_input,
      status = case when available_quantity - quantity_input <= 0 then 'sold_out' else status end
  where id = product_id_input
    and available_quantity >= quantity_input
    and status in ('available', 'preorder')
  returning available_quantity into remaining;

  if remaining is null then
    raise exception 'Not enough inventory available for product %', product_id_input;
  end if;
end;
$$ language plpgsql;
