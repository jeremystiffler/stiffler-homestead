# Stiffler Homestead Storefront Backend

This site now supports an editable product backend and Stripe checkout with automatic inventory decrement.

## Required services

1. Supabase project for products + orders
2. Stripe account for checkout and webhook payments
3. Optional PayPal/Venmo links per product for manual payment options

## Supabase setup

1. Create/open a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql` from this repo.
4. Copy these values from Supabase settings:
   - Project URL
   - Anon public key
   - Service role key

## Vercel environment variables

Add these to the Stiffler Homestead Vercel project:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=choose-a-strong-password
STRIPE_SECRET_KEY=sk_live_or_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://stiffler-homestead.vercel.app
```

## Stripe webhook

In Stripe Dashboard → Developers → Webhooks, add endpoint:

```text
https://stiffler-homestead.vercel.app/api/stripe/webhook
```

Listen for:

```text
checkout.session.completed
```

Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

## Admin page

Go to:

```text
https://stiffler-homestead.vercel.app/admin
```

Use `ADMIN_PASSWORD` to load and save products.

You can edit:

- product name/category/description
- image URL + alt text
- price in cents
- available quantity
- status: `available`, `preorder`, `sold_out`, `coming_soon`
- pickup and availability notes
- PayPal URL
- Venmo URL

## Inventory behavior

- Stripe checkout only appears when a product is orderable and has a price greater than $0.
- After Stripe confirms payment via webhook, the order becomes `paid` and inventory is decremented.
- When inventory reaches 0, the product is marked `sold_out`.
- PayPal/Venmo links are manual backup options and do not auto-decrement inventory.
