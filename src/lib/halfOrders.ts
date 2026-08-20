import { isWholeQuantity } from "./quantity";

export const HALF_ORDERS_MARKER = "[[stiffler:allow_half_orders=true]]";

export type HalfOrderProduct = {
  allow_half_orders?: boolean | null;
  allowHalfOrders?: boolean | null;
  price_note?: string | null;
  priceNote?: string | null;
};

export function stripHalfOrdersMarker(value?: string | null) {
  return (value || "").replace(HALF_ORDERS_MARKER, "").replace(/\s{2,}/g, " ").trim();
}

export function withHalfOrdersMarker(value: unknown, enabled: boolean) {
  const cleaned = stripHalfOrdersMarker(typeof value === "string" ? value : value == null ? "" : String(value));
  return enabled ? [cleaned, HALF_ORDERS_MARKER].filter(Boolean).join(" ") : cleaned || null;
}

export function allowsHalfOrders(product: HalfOrderProduct) {
  return Boolean(product.allow_half_orders ?? product.allowHalfOrders ?? (product.price_note || product.priceNote || "").includes(HALF_ORDERS_MARKER));
}

export function isAllowedOrderQuantity(product: HalfOrderProduct, quantity: number) {
  return allowsHalfOrders(product) || isWholeQuantity(quantity);
}