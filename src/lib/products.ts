import { PRODUCTS, type HomesteadProduct } from "@/content/products";
import { SITE_CONFIG } from "@/lib/config";
import { isInfiniteQuantityProduct } from "@/lib/inventory";
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
  infinite_quantity?: boolean | null;
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

export function defaultVenmoUrl() {
  return SITE_CONFIG.venmoHandle ? `https://venmo.com/${SITE_CONFIG.venmoHandle}` : undefined;
}

function isPublicProduct(row: { status?: string }) {
  return row.status !== "hidden" && row.status !== "coming_soon";
}

export function rowToProduct(row: ProductRow): HomesteadProduct {
  const infiniteQuantity = isInfiniteQuantityProduct(row);
  const status = infiniteQuantity && row.status === "sold_out" ? "available" : row.status;

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
    infiniteQuantity,
    status: !infiniteQuantity && row.available_quantity <= 0 && (status === "available" || status === "preorder") ? "sold_out" : status,
    availabilityWindow: row.availability_window,
    pickupNote: row.pickup_note,
    imageUrl: row.image_url || undefined,
    imageAlt: row.image_alt || row.name,
    imageEmoji: row.image_emoji || "🌱",
    soldOutMessage: row.sold_out_message,
    featured: row.featured,
    paypalUrl: row.paypal_url || undefined,
    venmoUrl: row.venmo_url || defaultVenmoUrl(),
  };
}

export async function getAllProducts() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return PRODUCTS.filter(isPublicProduct);

  const { data, error } = await supabase
    .from("homestead_products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Supabase product fetch failed; falling back to static products", error);
    return PRODUCTS;
  }

  return (data || [])
    .filter(isPublicProduct)
    .map((row) => rowToProduct(row as ProductRow));
}

export async function getFeaturedProducts() {
  return (await getAllProducts()).filter((product) => product.featured);
}

export async function getProduct(slug: string) {
  return (await getAllProducts()).find((product) => product.slug === slug) || null;
}

export function isProductOrderable(product: { status: string; availableQuantity: number; infiniteQuantity?: boolean; priceCents?: number }) {
  if (isInfiniteQuantityProduct(product)) return product.status !== "hidden" && product.status !== "coming_soon";
  return (product.status === "available" || product.status === "preorder") && product.availableQuantity > 0;
}
