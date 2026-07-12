import { PRODUCTS, type HomesteadProduct } from "@/content/products";
import { formatPrice } from "@/lib/money";
import { getSupabaseServerClient } from "@/lib/supabase";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: HomesteadProduct["category"];
  description: string;
  price_cents: number;
  price_note: string | null;
  unit_label: string;
  available_quantity: number;
  status: HomesteadProduct["status"];
  availability_window: string;
  pickup_note: string;
  image_url: string | null;
  image_alt: string | null;
  image_emoji: string | null;
  sold_out_message: string;
  featured: boolean;
  paypal_url: string | null;
  venmo_url: string | null;
};

export function productPriceLabel(priceCents: number, fallback?: string) {
  return priceCents > 0 ? formatPrice(priceCents) : fallback || "Contact for pricing";
}

export function rowToProduct(row: ProductRow): HomesteadProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    priceCents: row.price_cents || 0,
    priceLabel: productPriceLabel(row.price_cents),
    priceNote: row.price_note || undefined,
    unitLabel: row.unit_label,
    availableQuantity: row.available_quantity,
    status: row.available_quantity <= 0 && (row.status === "available" || row.status === "preorder") ? "sold_out" : row.status,
    availabilityWindow: row.availability_window,
    pickupNote: row.pickup_note,
    imageUrl: row.image_url || undefined,
    imageAlt: row.image_alt || row.name,
    imageEmoji: row.image_emoji || "🌱",
    soldOutMessage: row.sold_out_message,
    featured: row.featured,
    paypalUrl: row.paypal_url || undefined,
    venmoUrl: row.venmo_url || undefined,
  };
}

export async function getAllProducts() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return PRODUCTS;

  const { data, error } = await supabase
    .from("homestead_products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Supabase product fetch failed; falling back to static products", error);
    return PRODUCTS;
  }

  return (data || []).map((row) => rowToProduct(row as ProductRow));
}

export async function getFeaturedProducts() {
  return (await getAllProducts()).filter((product) => product.featured);
}

export async function getProduct(slug: string) {
  return (await getAllProducts()).find((product) => product.slug === slug) || null;
}

export function isProductOrderable(product: { status: string; availableQuantity: number; priceCents?: number }) {
  return (product.status === "available" || product.status === "preorder") && product.availableQuantity > 0;
}
