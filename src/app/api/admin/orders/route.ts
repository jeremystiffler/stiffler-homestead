import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";
import { isInfiniteQuantityProduct } from "@/lib/inventory";
import { getSupabaseServerClient } from "@/lib/supabase";


export async function GET(request: Request) {
  if (!(await isAdminAuthorized(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 503 });

  const { data, error } = await supabase
    .from("homestead_orders")
    .select("*, product:homestead_products(name, slug)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data || [] });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthorized(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 503 });

  const body = await request.json();
  const orderId = String(body.orderId || "");
  const action = String(body.action || "");
  if (!orderId) return NextResponse.json({ error: "Order id is required." }, { status: 400 });

  const { data: order, error: orderError } = await supabase
    .from("homestead_orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  if (action === "mark_paid") {
    if (order.status === "paid") return NextResponse.json({ order });

    const { data: product, error: productError } = await supabase
      .from("homestead_products")
      .select("infinite_quantity")
      .eq("id", order.product_id)
      .single();

    if (productError) return NextResponse.json({ error: productError.message }, { status: 500 });

    if (!isInfiniteQuantityProduct(product || {})) {
      const { error: decrementError } = await supabase.rpc("decrement_homestead_product_inventory", {
        product_id_input: order.product_id,
        quantity_input: order.quantity,
      });

      if (decrementError) {
        await supabase.from("homestead_orders").update({ status: "inventory_error", notes: decrementError.message }).eq("id", orderId);
        return NextResponse.json({ error: decrementError.message }, { status: 409 });
      }
    }

    const { data: updated, error: updateError } = await supabase
      .from("homestead_orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", orderId)
      .select("*")
      .single();

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
    return NextResponse.json({ order: updated });
  }

  if (["cancelled", "refunded"].includes(action)) {
    const { data: updated, error: updateError } = await supabase
      .from("homestead_orders")
      .update({ status: action })
      .eq("id", orderId)
      .select("*")
      .single();
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
    return NextResponse.json({ order: updated });
  }

  return NextResponse.json({ error: "Unknown order action." }, { status: 400 });
}
