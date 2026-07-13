-- Adds an infinite/always-available inventory mode for products such as eggs.
-- Safe to run more than once in Supabase SQL editor.

alter table public.homestead_products
add column if not exists infinite_quantity boolean not null default false;

alter table public.homestead_products drop constraint if exists homestead_products_status_check;
alter table public.homestead_products
add constraint homestead_products_status_check check (status in ('available', 'preorder', 'sold_out', 'coming_soon', 'hidden'));

create or replace function public.decrement_homestead_product_inventory(product_id_input uuid, quantity_input integer)
returns void as $$
declare
  remaining integer;
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

update public.homestead_products
set infinite_quantity = true,
    status = case when status = 'sold_out' then 'available' else status end
where slug = 'farm-fresh-eggs';
