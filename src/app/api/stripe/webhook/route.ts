import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const supabase = getSupabaseServerClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !supabase || !webhookSecret) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });

  let event;
  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;
    const productId = session.metadata?.product_id;
    const quantity = Number(session.metadata?.quantity || 0);

    if (orderId && productId && quantity > 0) {
      const { data: order } = await supabase.from("homestead_orders").select("status").eq("id", orderId).single();
      if (order?.status !== "paid") {
        const { error: decrementError } = await supabase.rpc("decrement_homestead_product_inventory", {
          product_id_input: productId,
          quantity_input: quantity,
        });
        if (decrementError) {
          await supabase.from("homestead_orders").update({ status: "inventory_error", notes: decrementError.message }).eq("id", orderId);
          return NextResponse.json({ error: decrementError.message }, { status: 500 });
        }

        await supabase
          .from("homestead_orders")
          .update({
            status: "paid",
            stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
            paid_at: new Date().toISOString(),
          })
          .eq("id", orderId);
      }
    }
  }

  return NextResponse.json({ received: true });
}
