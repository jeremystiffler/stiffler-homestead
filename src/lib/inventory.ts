export const INFINITE_QUANTITY_MARKER = "[[stiffler:infinite_quantity=true]]";

type ProductInventoryShape = {
  infinite_quantity?: boolean | null;
  infiniteQuantity?: boolean | null;
  price_note?: string | null;
  priceNote?: string | null;
};

export function stripInfiniteQuantityMarker(value?: string | null) {
  return String(value || "").replace(INFINITE_QUANTITY_MARKER, "").trim();
}

export function withInfiniteQuantityMarker(value: unknown, enabled: boolean) {
  const cleaned = stripInfiniteQuantityMarker(typeof value === "string" ? value : value == null ? "" : String(value));
  if (!enabled) return cleaned || null;
  return [cleaned, INFINITE_QUANTITY_MARKER].filter(Boolean).join(" ");
}

export function isInfiniteQuantityProduct(product: ProductInventoryShape) {
  return Boolean(
    product.infinite_quantity ||
      product.infiniteQuantity ||
      String(product.price_note || "").includes(INFINITE_QUANTITY_MARKER) ||
      String(product.priceNote || "").includes(INFINITE_QUANTITY_MARKER),
  );
}
