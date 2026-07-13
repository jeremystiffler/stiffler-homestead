import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";
import { getSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function jsonNoStore(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  return response;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET(request: Request) {
  if (!(await isAdminAuthorized(request))) return jsonNoStore({ error: "Unauthorized" }, { status: 401 });
  const supabase = getSupabaseServerClient();
  if (!supabase) return jsonNoStore({ error: "Supabase is not configured yet." }, { status: 503 });

  const { data, error } = await supabase
    .from("homestead_products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return jsonNoStore({ error: error.message }, { status: 500 });
  return jsonNoStore({ products: data || [] });
}

function toBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return ["true", "1", "on", "yes"].includes(value.toLowerCase());
  return Boolean(value);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthorized(request))) return jsonNoStore({ error: "Unauthorized" }, { status: 401 });
  const supabase = getSupabaseServerClient();
  if (!supabase) return jsonNoStore({ error: "Supabase is not configured yet." }, { status: 503 });

  const body = await request.json();
  const productId = String(body.id || "").trim();
  const incomingSlug = String(body.slug || "").trim();

  let existingProduct: Record<string, unknown> | null = null;
  if (productId || incomingSlug) {
    const existingQuery = supabase.from("homestead_products").select("*").limit(1);
    const { data } = productId
      ? await existingQuery.eq("id", productId).maybeSingle()
      : await existingQuery.eq("slug", incomingSlug).maybeSingle();
    existingProduct = data || null;
  }

  const name = String(body.name ?? existingProduct?.name ?? "").trim();
  if (!name) return jsonNoStore({ error: "Choose a product or enter a product name before saving." }, { status: 400 });

  const requestedInfiniteQuantity = toBoolean(body.infinite_quantity ?? body.infiniteQuantity ?? existingProduct?.infinite_quantity);
  const status = String(body.status ?? existingProduct?.status ?? "coming_soon");
  const row = {
    slug: String(body.slug ?? existingProduct?.slug ?? slugify(name)),
    name,
    category: body.category ?? existingProduct?.category ?? "Meat chickens",
    description: body.description ?? existingProduct?.description ?? "",
    price_cents: Math.max(0, Number(body.price_cents ?? existingProduct?.price_cents ?? 0)),
    price_note: body.price_note ?? existingProduct?.price_note ?? null,
    unit_label: String(body.unit_label ?? existingProduct?.unit_label ?? "").trim() || "items",
    available_quantity: Math.max(0, Number(body.available_quantity ?? existingProduct?.available_quantity ?? 0)),
    infinite_quantity: requestedInfiniteQuantity,
    status,
    availability_window: body.availability_window ?? existingProduct?.availability_window ?? "Update availability",
    pickup_note: body.pickup_note ?? existingProduct?.pickup_note ?? "Local pickup details will be confirmed after purchase.",
    image_url: body.image_url ?? existingProduct?.image_url ?? null,
    image_alt: body.image_alt ?? existingProduct?.image_alt ?? name,
    image_emoji: body.image_emoji ?? existingProduct?.image_emoji ?? "🌱",
    sold_out_message: body.sold_out_message ?? existingProduct?.sold_out_message ?? "Sold out. Contact us for next availability.",
    featured: status === "hidden" ? false : toBoolean(body.featured ?? existingProduct?.featured),
    paypal_url: body.paypal_url ?? existingProduct?.paypal_url ?? null,
    venmo_url: body.venmo_url ?? existingProduct?.venmo_url ?? null,
    sort_order: Number(body.sort_order ?? existingProduct?.sort_order ?? 100),
  };
  const saveQuery = productId
    ? supabase.from("homestead_products").update(row).eq("id", productId)
    : supabase.from("homestead_products").upsert(row, { onConflict: "slug" });

  const { data: savedProduct, error: saveError } = await saveQuery.select("id,slug").single();

  if (saveError) return jsonNoStore({ error: saveError.message }, { status: 500 });
  if (!savedProduct) return jsonNoStore({ error: "Product save did not return a saved row." }, { status: 500 });

  const readbackQuery = supabase.from("homestead_products").select("*").limit(1);
  const { data: readback, error: readbackError } = productId
    ? await readbackQuery.eq("id", savedProduct.id).single()
    : await readbackQuery.eq("slug", savedProduct.slug).single();

  if (readbackError) return jsonNoStore({ error: readbackError.message }, { status: 500 });
  if (!readback) return jsonNoStore({ error: "Product save completed, but DB readback returned no row." }, { status: 500 });

  if (Boolean(readback.infinite_quantity) !== requestedInfiniteQuantity) {
    return jsonNoStore({
      error: "Product saved, but DB readback shows infinite quantity did not persist.",
      product: readback,
      requestedInfiniteQuantity,
      persistedInfiniteQuantity: Boolean(readback.infinite_quantity),
    }, { status: 500 });
  }

  return jsonNoStore({ product: readback });
}
