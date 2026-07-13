-- Stiffler Homestead storefront backend
-- Run this in Supabase SQL editor, then add the env vars listed in README-storefront-backend.md to Vercel.

create extension if not exists "pgcrypto";

create table if not exists public.homestead_products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('Meat chickens', 'Pork', 'Lamb', 'Eggs', 'Honey')),
  description text not null default '',
  price_cents integer not null default 0 check (price_cents >= 0),
  price_note text,
  unit_label text not null default 'items',
  available_quantity integer not null default 0 check (available_quantity >= 0),
  infinite_quantity boolean not null default false,
  status text not null default 'coming_soon' check (status in ('available', 'preorder', 'sold_out', 'coming_soon', 'hidden')),
  availability_window text not null default 'Update availability',
  pickup_note text not null default 'Local pickup details will be confirmed after purchase.',
  image_url text,
  image_alt text,
  image_emoji text default '🌱',
  sold_out_message text not null default 'Sold out. Contact us for next availability.',
  featured boolean not null default true,
  paypal_url text,
  venmo_url text,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.homestead_orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.homestead_products(id),
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled', 'refunded', 'inventory_error')),
  customer_email text,
  customer_name text,
  customer_phone text,
  payment_provider text not null default 'stripe',
  stripe_session_id text,
  stripe_payment_intent_id text,
  notes text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists homestead_products_updated_at on public.homestead_products;
create trigger homestead_products_updated_at
before update on public.homestead_products
for each row execute function public.set_updated_at();

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

alter table public.homestead_products enable row level security;
alter table public.homestead_orders enable row level security;

-- Public read access for product cards. All writes happen through server routes using the service role key.
drop policy if exists "Public can read homestead products" on public.homestead_products;
create policy "Public can read homestead products"
on public.homestead_products for select
to anon
using (true);

alter table public.homestead_products
add column if not exists infinite_quantity boolean not null default false;

alter table public.homestead_products drop constraint if exists homestead_products_status_check;
alter table public.homestead_products
add constraint homestead_products_status_check check (status in ('available', 'preorder', 'sold_out', 'coming_soon', 'hidden'));

insert into public.homestead_products
(slug, name, category, description, price_cents, price_note, unit_label, available_quantity, infinite_quantity, status, availability_window, pickup_note, image_emoji, image_alt, sold_out_message, featured, sort_order)
values
('pasture-raised-meat-chickens', 'Pasture-Raised Meat Chickens', 'Meat chickens', 'Whole processed chickens raised on our family homestead. Reserve your birds ahead of processing day.', 0, 'Price will be confirmed before pickup.', 'whole chickens', 30, false, 'preorder', 'Next batch: update with processing month', 'Local pickup near Lexington, KY. We will confirm date, time, and final total before pickup.', '🐓', 'Pasture-raised meat chickens from Stiffler Homestead', 'This chicken batch is sold out. Contact us to get on the next availability list.', true, 10),
('pasture-raised-pork', 'Pasture-Raised Pork', 'Pork', 'Homestead-raised pork availability, deposits, shares, and cuts can be listed here as each season is ready.', 0, null, 'shares or cuts', 0, false, 'coming_soon', 'Future availability', 'Join the interest list and we will contact you when pork is available.', '🐖', 'Pasture-raised pork from Stiffler Homestead', 'Pork is not currently available. Contact us for the next season.', true, 20),
('pasture-raised-lamb', 'Pasture-Raised Lamb', 'Lamb', 'Whole/half lamb or cut availability can be edited here when lamb is ready for reservation.', 0, null, 'shares or cuts', 0, false, 'coming_soon', 'Future availability', 'Join the lamb interest list and we will reach out when availability opens.', '🐑', 'Pasture-raised lamb from Stiffler Homestead', 'Lamb is not currently available. Contact us for next availability.', true, 30),
('farm-fresh-eggs', 'Farm-Fresh Eggs', 'Eggs', 'Egg availability from our laying hens. Update quantity and price as weekly inventory changes.', 0, 'Egg price will be confirmed before pickup.', 'dozens', 0, true, 'available', 'Weekly availability varies', 'Local pickup only. We will confirm current inventory before pickup.', '🥚', 'Farm-fresh eggs from Stiffler Homestead', 'Eggs are currently sold out. Contact us for the next available dozens.', true, 40),
('homestead-honey', 'Homestead Honey', 'Honey', 'A future spot for honey if/when it becomes available from the homestead.', 0, null, 'jars', 0, false, 'coming_soon', 'Possible future product', 'Join the interest list and we will let you know if honey becomes available.', '🍯', 'Future homestead honey from Stiffler Homestead', 'Honey is not available yet. Contact us to hear about future batches.', false, 50)
on conflict (slug) do nothing;

update public.homestead_products
set infinite_quantity = true,
    status = case when status = 'sold_out' then 'available' else status end
where slug = 'farm-fresh-eggs';
