import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";
import { getSupabaseServerClient } from "@/lib/supabase";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET(request: Request) {
  if (!(await isAdminAuthorized(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 503 });

  const { data, error } = await supabase
    .from("homestead_products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data || [] });
}

function toBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return ["true", "1", "on", "yes"].includes(value.toLowerCase());
  return Boolean(value);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthorized(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 503 });

  const body = await request.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Product name is required." }, { status: 400 });

  const requestedInfiniteQuantity = toBoolean(body.infinite_quantity ?? body.infiniteQuantity);
  const row = {
    slug: String(body.slug || slugify(name)),
    name,
    category: body.category || "Meat chickens",
    description: body.description || "",
    price_cents: Math.max(0, Number(body.price_cents || 0)),
    price_note: body.price_note || null,
    unit_label: String(body.unit_label || "").trim() || "items",
    available_quantity: Math.max(0, Number(body.available_quantity || 0)),
    infinite_quantity: requestedInfiniteQuantity,
    status: body.status || "coming_soon",
    availability_window: body.availability_window || "Update availability",
    pickup_note: body.pickup_note || "Local pickup details will be confirmed after purchase.",
    image_url: body.image_url || null,
    image_alt: body.image_alt || name,
    image_emoji: body.image_emoji || "🌱",
    sold_out_message: body.sold_out_message || "Sold out. Contact us for next availability.",
    featured: body.status === "hidden" ? false : Boolean(body.featured),
    paypal_url: body.paypal_url || null,
    venmo_url: body.venmo_url || null,
    sort_order: Number(body.sort_order || 100),
  };

  const productId = String(body.id || "").trim();
  const saveQuery = productId
    ? supabase.from("homestead_products").update(row).eq("id", productId)
    : supabase.from("homestead_products").upsert(row, { onConflict: "slug" });

  const { data, error } = await saveQuery.select("*").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Product save did not return a saved row." }, { status: 500 });

  if (Boolean(data.infinite_quantity) !== requestedInfiniteQuantity) {
    return NextResponse.json({
      error: "Product saved, but the infinite quantity value did not persist in the database.",
      product: data,
    }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}
