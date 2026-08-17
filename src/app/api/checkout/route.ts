import { NextResponse } from "next/server";
import { isInfiniteQuantityProduct } from "@/lib/inventory";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { formatQuantity, isWholeQuantity, parseOrderQuantity } from "@/lib/quantity";
import { CARD_PROCESSING_FEE_BPS, CARD_PROCESSING_FIXED_FEE_CENTS, cardProcessingFeeCents } from "@/lib/cardFee";

export async function POST(request: Request) {
  const stripe = getStripe();
  const supabase = getSupabaseServerClient();
  if (!stripe) return NextResponse.json({ error: "Stripe is not configured yet." }, { status: 503 });
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 503 });

  const body = await request.json();
  const productId = body.productId ? String(body.productId) : "";
  const slug = body.slug ? String(body.slug) : "";
  const quantity = parseOrderQuantity(body.quantity || 1);
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
  const infiniteQuantity = isInfiniteQuantityProduct(product);
  const status = infiniteQuantity && product.status === "sold_out" ? "available" : product.status;
  if (!["available", "preorder"].includes(status) || (!infiniteQuantity && product.available_quantity < quantity)) {
    return NextResponse.json({ error: "That quantity is not available." }, { status: 400 });
  }
  if (!product.price_cents || product.price_cents <= 0) {
    return NextResponse.json({ error: "This product does not have checkout pricing yet." }, { status: 400 });
  }
  const subtotalCents = Math.round(Number(product.price_cents) * quantity);
  const cardFeeCents = cardProcessingFeeCents(subtotalCents);
  const totalCents = subtotalCents + cardFeeCents;
  const quantityLabel = `${formatQuantity(quantity)} ${product.unit_label}`;
  const stripeLineItemQuantity = isWholeQuantity(quantity) ? quantity : 1;
  const stripeUnitAmount = isWholeQuantity(quantity) ? product.price_cents : subtotalCents;
  const stripeProductName = isWholeQuantity(quantity) ? product.name : `${product.name} (${quantityLabel})`;

  const { data: order, error: orderError } = await supabase
    .from("homestead_orders")
    .insert({
      product_id: product.id,
      quantity,
      unit_price_cents: product.price_cents,
      total_cents: totalCents,
      status: "pending",
      customer_email: customerEmail || null,
      customer_name: customerName || null,
      customer_phone: customerPhone || null,
      payment_provider: "stripe",
      notes: `Card processing fee (${CARD_PROCESSING_FEE_BPS / 100}% + ${CARD_PROCESSING_FIXED_FEE_CENTS}¢): ${cardFeeCents} cents.`,
    })
    .select("*")
    .single();

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stifflerhomestead.store";
  const productImage = typeof product.image_url === "string" && /^https:\/\//.test(product.image_url) && product.image_url.length <= 2048
    ? product.image_url
    : undefined;

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail || undefined,
      success_url: `${siteUrl}/products?checkout=success&order=${order.id}`,
      cancel_url: `${siteUrl}/products?checkout=cancelled&order=${order.id}`,
      metadata: {
        order_id: order.id,
        product_id: product.id,
        quantity: String(quantity),
        subtotal_cents: String(subtotalCents),
        card_processing_fee_cents: String(cardFeeCents),
        total_cents: String(totalCents),
      },
      line_items: [
        {
          quantity: stripeLineItemQuantity,
          price_data: {
            currency: "usd",
            unit_amount: stripeUnitAmount,
            product_data: {
              name: stripeProductName,
              description: String(product.description || "").slice(0, 1000),
              images: productImage ? [productImage] : undefined,
            },
          },
          },
          ...(cardFeeCents > 0
          ? [{
              quantity: 1,
              price_data: {
                currency: "usd" as const,
                unit_amount: cardFeeCents,
                product_data: {
                  name: `Card processing fee (${CARD_PROCESSING_FEE_BPS / 100}% + ${CARD_PROCESSING_FIXED_FEE_CENTS}¢)`,
                  description: "Charged for card checkout only. Venmo purchases do not include this fee.",
                },
              },
            }]
          : []),
          ],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe checkout could not be created.";
    await supabase.from("homestead_orders").update({ status: "cancelled", notes: message }).eq("id", order.id);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  await supabase.from("homestead_orders").update({ stripe_session_id: session.id }).eq("id", order.id);
  return NextResponse.json({ url: session.url });
}
