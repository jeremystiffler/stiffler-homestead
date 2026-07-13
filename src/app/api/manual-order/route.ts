import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 503 });

  const body = await request.json();
  const provider = String(body.provider || "").toLowerCase();
  if (!["paypal", "venmo"].includes(provider)) {
    return NextResponse.json({ error: "Payment provider must be PayPal or Venmo." }, { status: 400 });
  }

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

  const paymentUrl = provider === "paypal" ? product.paypal_url : product.venmo_url;
  if (!paymentUrl) return NextResponse.json({ error: `${provider} is not configured for this product.` }, { status: 400 });

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
      payment_provider: provider,
      notes: "Manual payment order. Inventory will reduce when admin marks this order paid.",
    })
    .select("*")
    .single();

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });
  return NextResponse.json({ order, paymentUrl });
}
