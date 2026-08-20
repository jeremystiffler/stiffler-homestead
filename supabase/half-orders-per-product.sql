-- Whole products are the default. Enable this only per product in admin.
alter table public.homestead_products
add column if not exists allow_half_orders boolean not null default false;

-- Explicitly reset existing products to whole-only for a safe rollout.
update public.homestead_products
set allow_half_orders = false
where allow_half_orders is distinct from false;