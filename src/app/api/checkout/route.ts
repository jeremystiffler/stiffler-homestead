import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const supabase = getSupabaseServerClient();
  if (!stripe) return NextResponse.json({ error: "Stripe is not configured yet." }, { status: 503 });
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 503 });

  const body = await request.json();
  const productId = body.productId ? String(body.productId) : "";
  const slug = body.slug ? String(body.slug) : "";
  const quantity = Math.max(1, Math.floor(Number(body.quantity || 1)));
  const customerEmail = String(body.customerEmail || "").trim();
  const customerName = String(body.customerName || "").trim();
  const customerPhone = String(body.customerPhone || "").trim();

  const query = supabase.from("homestead_products").select("*").limit(1);
  const { data: products, error: productError } = productId
    ? await query.eq("id", productId)
    : await query.eq("slug", slug);

  if (productError) return NextResponse.json({ error: productError.message }, { status: 500 });
  const product = products?.[0];
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  if (!["available", "preorder"].includes(product.status) || product.available_quantity < quantity) {
    return NextResponse.json({ error: "That quantity is not available." }, { status: 400 });
  }
  if (!product.price_cents || product.price_cents <= 0) {
    return NextResponse.json({ error: "This product does not have checkout pricing yet." }, { status: 400 });
  }

  const { data: order, error: orderError } = await supabase
    .from("homestead_orders")
    .insert({
      product_id: product.id,
      quantity,
      unit_price_cents: product.price_cents,
      total_cents: product.price_cents * quantity,
      status: "pending",
      customer_email: customerEmail || null,
      customer_name: customerName || null,
      customer_phone: customerPhone || null,
      payment_provider: "stripe",
    })
    .select("*")
    .single();

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stiffler-homestead.vercel.app";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail || undefined,
    success_url: `${siteUrl}/products?checkout=success&order=${order.id}`,
    cancel_url: `${siteUrl}/products?checkout=cancelled&order=${order.id}`,
    metadata: {
      order_id: order.id,
      product_id: product.id,
      quantity: String(quantity),
    },
    line_items: [
      {
        quantity,
        price_data: {
          currency: "usd",
          unit_amount: product.price_cents,
          product_data: {
            name: product.name,
            description: product.description,
            images: product.image_url ? [product.image_url] : undefined,
          },
        },
      },
    ],
  });

  await supabase.from("homestead_orders").update({ stripe_session_id: session.id }).eq("id", order.id);
  return NextResponse.json({ url: session.url });
}
